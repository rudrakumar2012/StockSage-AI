"""
Backtester — Historical Win Rate Calculator

For each signal type, looks back 90 days and checks: when the scanner
would have fired this signal, did the stock actually move in the
predicted direction by at least 1% within 3 trading days?

Optimized: fetches all sentiment data upfront (1 query), no per-stock
sleep, minimal API calls.
"""

import yfinance as yf
import pandas as pd
from datetime import datetime
import os

import sqlite3

try:
    import psycopg2
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

DATABASE_URL = os.environ.get("DATABASE_URL")
DB_PATH = os.environ.get("DB_PATH", "local_market.db")


def get_connection():
    if DATABASE_URL and HAS_POSTGRES:
        return psycopg2.connect(DATABASE_URL)
    else:
        if not HAS_POSTGRES and DATABASE_URL:
            print("[WARNING] DATABASE_URL found but psycopg2 not installed. Falling back to SQLite.")
        return sqlite3.connect(DB_PATH)


def get_placeholder():
    return "%s" if DATABASE_URL and HAS_POSTGRES else "?"


def calculate_rsi(data, window=14):
    """Calculate RSI for a pandas Series or DataFrame with 'Close' column."""
    delta = data['Close'].diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)

    ema_up = up.ewm(com=window-1, adjust=False).mean()
    ema_down = down.ewm(com=window-1, adjust=False).mean()

    rs = ema_up / ema_down
    rsi = 100 - (100 / (1 + rs))
    return rsi


def ensure_backtest_table(cursor, is_pg):
    """Create signal_backtest table if it doesn't exist."""
    if is_pg:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS signal_backtest (
                id SERIAL PRIMARY KEY,
                signal_type TEXT NOT NULL,
                win_rate DOUBLE PRECISION NOT NULL,
                total_signals INTEGER DEFAULT 0,
                correct_signals INTEGER DEFAULT 0,
                last_backtest_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
    else:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS signal_backtest (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                signal_type TEXT NOT NULL,
                win_rate REAL NOT NULL,
                total_signals INTEGER DEFAULT 0,
                correct_signals INTEGER DEFAULT 0,
                last_backtest_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)


def evaluate_signal(rsi_val, volume_spike, sentiment_score, sentiment_label):
    """
    Apply the same multi-factor rules as alpha_scanner.py.
    Returns signal name or "NONE".
    """
    if sentiment_label in ("NO_DATA", None):
        return "NONE"

    if rsi_val < 35 and sentiment_score > 0.3 and volume_spike > 1.0:
        return "OVERSOLD_BOUNCE"
    if volume_spike > 1.5 and 55 < rsi_val < 70 and sentiment_score > 0.3:
        return "MOMENTUM_SPIKE"
    if rsi_val > 70 and sentiment_score < -0.3 and volume_spike > 1.0:
        return "MEAN_REVERSION"
    if volume_spike > 1.5 and rsi_val < 40 and sentiment_score < -0.3:
        return "BEARISH_DUMP"

    return "NONE"


def run_backtest():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        p = get_placeholder()
        is_pg = DATABASE_URL and HAS_POSTGRES

        ensure_backtest_table(cursor, is_pg)
        conn.commit()

        # Fetch all stocks with sentiment data upfront (1 query instead of N per day)
        cursor.execute("SELECT symbol, sentiment_score, sentiment_label FROM stocks WHERE sentiment_label != 'NO_DATA'")
        sentiment_map = {}
        for row in cursor.fetchall():
            sentiment_map[row[0]] = (row[1] if row[1] is not None else 0.0, row[2])

        # Only backtest stocks that have sentiment data
        stocks_with_sentiment = list(sentiment_map.keys())
        if not stocks_with_sentiment:
            print("[BACKTEST] No stocks with sentiment data. Run finbert_analyzer.py first.")
            return

        now = datetime.now().strftime('%Y-%m-%d %H:%M')
        print(f"\n[{now}] [BACKTESTER] Running historical analysis for {len(stocks_with_sentiment)} symbols...", flush=True)

        # Accumulate results per signal type
        signal_stats = {
            "OVERSOLD_BOUNCE": {"total": 0, "correct": 0},
            "MOMENTUM_SPIKE": {"total": 0, "correct": 0},
            "MEAN_REVERSION": {"total": 0, "correct": 0},
            "BEARISH_DUMP": {"total": 0, "correct": 0},
        }

        for symbol in stocks_with_sentiment:
            try:
                print(f"  -> {symbol}...", end=" ", flush=True)

                ticker = yf.Ticker(f"{symbol}.NS")
                hist = ticker.history(period="90d")

                if hist.empty or len(hist) < 30:
                    ticker = yf.Ticker(f"{symbol}.BO")
                    hist = ticker.history(period="90d")

                if hist.empty or len(hist) < 30:
                    print("SKIP", flush=True)
                    continue

                hist['Close'] = hist['Close'].ffill()
                rsi_series = calculate_rsi(hist)

                sentiment_score, sentiment_label = sentiment_map.get(symbol, (0.0, "NO_DATA"))

                for i in range(20, len(hist) - 3):
                    rsi_val = rsi_series.iloc[i]
                    if pd.isna(rsi_val):
                        continue

                    current_volume = hist['Volume'].iloc[i]
                    avg_volume = hist['Volume'].iloc[i-20:i].mean()
                    volume_spike = current_volume / avg_volume if avg_volume > 0 else 1.0

                    signal = evaluate_signal(rsi_val, volume_spike, sentiment_score, sentiment_label)

                    if signal == "NONE":
                        continue

                    # Check if the signal was correct:
                    # Bullish: price goes up >=1% within 3 days
                    # Bearish: price goes down >=1% within 3 days
                    current_price = hist['Close'].iloc[i]
                    future_prices = hist['Close'].iloc[i+1:i+4]

                    if len(future_prices) == 0:
                        continue

                    max_future = future_prices.max()
                    min_future = future_prices.min()

                    is_bullish = signal in ("OVERSOLD_BOUNCE", "MOMENTUM_SPIKE")

                    signal_stats[signal]["total"] += 1

                    if is_bullish:
                        if max_future >= current_price * 1.01:
                            signal_stats[signal]["correct"] += 1
                    else:
                        if min_future <= current_price * 0.99:
                            signal_stats[signal]["correct"] += 1

                print("OK", flush=True)

            except Exception as e:
                print(f"ERROR: {e}", flush=True)
                continue

        # Store results in signal_backtest table
        print(f"\n[BACKTEST] Results:", flush=True)
        for signal_type, stats in signal_stats.items():
            total = stats["total"]
            correct = stats["correct"]
            win_rate = round((correct / total * 100), 1) if total > 0 else 0.0

            print(f"  {signal_type}: {correct}/{total} = {win_rate}% win rate", flush=True)

            # Delete old record and insert new
            cursor.execute(f"DELETE FROM signal_backtest WHERE signal_type = {p}", (signal_type,))

            if is_pg:
                cursor.execute(
                    f"INSERT INTO signal_backtest (signal_type, win_rate, total_signals, correct_signals, last_backtest_at) VALUES ({p}, {p}, {p}, {p}, NOW())",
                    (signal_type, win_rate, total, correct)
                )
            else:
                cursor.execute(
                    "INSERT INTO signal_backtest (signal_type, win_rate, total_signals, correct_signals, last_backtest_at) VALUES (?, ?, ?, ?, datetime('now'))",
                    (signal_type, win_rate, total, correct)
                )

        conn.commit()
        conn.close()
        print(f"\n[BACKTEST SUCCESS] Win rates synced to database.", flush=True)

    except Exception as e:
        print(f"\n[BACKTEST CRITICAL ERROR] {e}", flush=True)


if __name__ == "__main__":
    run_backtest()