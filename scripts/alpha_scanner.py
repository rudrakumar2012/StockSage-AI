"""
Alpha Scanner — Multi-Factor Confluence Model

Signals require 3+ concurring factors before firing. No signal fires
without sentiment data (NO_DATA stocks are skipped).

Signal rules:
  OVERSOLD_BOUNCE: RSI < 35 AND sentiment > 0.3 AND volume_spike > 1.0
  MOMENTUM_SPIKE: volume_spike > 1.5 AND RSI 55-70 AND sentiment > 0.3
  MEAN_REVERSION: RSI > 70 AND sentiment < -0.3 AND volume_spike > 1.0
  BEARISH_DUMP:   volume_spike > 1.5 AND RSI < 40 AND sentiment < -0.3

Confidence comes from backtested win rates in the signal_backtest table.
If no backtest data exists, confidence defaults to 50.0 (honest "unknown").
"""

import yfinance as yf
import pandas as pd
import time
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
    """Calculate the Relative Strength Index (RSI)"""
    delta = data['Close'].diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)

    ema_up = up.ewm(com=window-1, adjust=False).mean()
    ema_down = down.ewm(com=window-1, adjust=False).mean()

    rs = ema_up / ema_down
    rsi = 100 - (100 / (1 + rs))
    return rsi.iloc[-1]


def get_backtest_confidence(cursor, signal_type):
    """Read the backtested win rate for a signal type. Returns 50.0 if no data."""
    p = get_placeholder()
    is_pg = DATABASE_URL and HAS_POSTGRES

    try:
        if is_pg:
            cursor.execute(
                f"SELECT win_rate FROM signal_backtest WHERE signal_type = {p} ORDER BY last_backtest_at DESC LIMIT 1",
                (signal_type,)
            )
        else:
            cursor.execute(
                f"SELECT win_rate FROM signal_backtest WHERE signal_type = {p} ORDER BY last_backtest_at DESC LIMIT 1",
                (signal_type,)
            )
        row = cursor.fetchone()
        if row and row[0] is not None:
            return round(float(row[0]), 1)
    except Exception:
        # Table might not exist yet
        pass

    # No backtest data — honest default
    return 50.0


def analyze_alpha():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        p = get_placeholder()

        cursor.execute("SELECT symbol, sentiment_score, sentiment_label FROM stocks")
        stocks = cursor.fetchall()

        if not stocks:
            print("[ALPHA] No stocks found. Run market_sync.py first.")
            return

        now = datetime.now().strftime('%Y-%m-%d %H:%M')
        print(f"\n[{now}] [ALPHA SCANNER] Crunching Multi-Factor Models for {len(stocks)} symbols...", flush=True)

        for row in stocks:
            symbol = row[0]
            sentiment_score = row[1] if row[1] is not None else 0.0
            sentiment_label = row[2] if row[2] else "NO_DATA"

            try:
                print(f"  -> Scanning {symbol}...", end=" ", flush=True)

                ticker = yf.Ticker(f"{symbol}.NS")
                hist = ticker.history(period="60d")

                if hist.empty or len(hist) < 20:
                    ticker = yf.Ticker(f"{symbol}.BO")
                    hist = ticker.history(period="60d")

                if not hist.empty and len(hist) >= 20:
                    hist['Close'] = hist['Close'].ffill()
                    rsi = float(calculate_rsi(hist))

                    current_volume = float(hist['Volume'].iloc[-1])
                    avg_volume_20d = float(hist['Volume'].tail(20).mean())
                    volume_spike = float(current_volume / avg_volume_20d if avg_volume_20d > 0 else 1)

                    signal = "NONE"
                    confidence = 0.0

                    # Skip stocks without sentiment data — no signal should fire blind
                    has_sentiment = sentiment_label not in ("NO_DATA", None)

                    if has_sentiment:
                        # OVERSOLD_BOUNCE: RSI < 35 AND bullish sentiment AND normal+ volume
                        if rsi < 35 and sentiment_score > 0.3 and volume_spike > 1.0:
                            signal = "OVERSOLD_BOUNCE"
                            confidence = get_backtest_confidence(cursor, "OVERSOLD_BOUNCE")

                        # MOMENTUM_SPIKE: Strong volume AND RSI 55-70 AND bullish sentiment
                        elif volume_spike > 1.5 and 55 < rsi < 70 and sentiment_score > 0.3:
                            signal = "MOMENTUM_SPIKE"
                            confidence = get_backtest_confidence(cursor, "MOMENTUM_SPIKE")

                        # MEAN_REVERSION: Overbought AND bearish sentiment AND normal+ volume
                        elif rsi > 70 and sentiment_score < -0.3 and volume_spike > 1.0:
                            signal = "MEAN_REVERSION"
                            confidence = get_backtest_confidence(cursor, "MEAN_REVERSION")

                        # BEARISH_DUMP: High volume AND low RSI AND bearish sentiment
                        elif volume_spike > 1.5 and rsi < 40 and sentiment_score < -0.3:
                            signal = "BEARISH_DUMP"
                            confidence = get_backtest_confidence(cursor, "BEARISH_DUMP")

                    # Update stock with signal, confidence, and technical indicators
                    cursor.execute(
                        f"UPDATE stocks SET ai_signal = {p}, ai_confidence = {p}, "
                        f"rsi = {p}, volume = {p}, avg_volume = {p}, volume_spike = {p}, "
                        f"last_signal_at = {p} WHERE symbol = {p}",
                        (signal, confidence, round(rsi, 2), current_volume, avg_volume_20d,
                         round(volume_spike, 2), now, symbol)
                    )
                    conn.commit()

                    color = "\033[92m" if signal != "NONE" and ("UP" in signal or "BOUNCE" in signal or "MOMENTUM" in signal) else "\033[91m" if signal != "NONE" else "\033[90m"
                    sent_info = f"sent={sentiment_score}" if has_sentiment else "NO_SENTIMENT"
                    print(f"[{color}{signal}\033[0m] RSI: {round(rsi,1)}, Vol: {round(volume_spike,1)}x, {sent_info}", flush=True)
                else:
                    print("[\033[90mINSUFFICIENT DATA\033[0m]", flush=True)

                time.sleep(0.5)

            except Exception as e:
                print(f"[\033[91mERROR\033[0m] {e}", flush=True)
                continue

        conn.close()
        print(f"\n[ALPHA SUCCESS] Signals synced to Terminal. Confidence values reflect backtested win rates.", flush=True)

    except Exception as e:
        print(f"\n[ALPHA CRITICAL ERROR] {e}", flush=True)


if __name__ == "__main__":
    analyze_alpha()