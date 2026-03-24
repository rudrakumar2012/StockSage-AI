import sqlite3
import yfinance as yf
import pandas as pd
import time
from datetime import datetime
import sys
import os

DB_PATH = os.environ.get("DB_PATH", ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/cf484200e53006c67c54974dc28ae4e13cd5680de51b367ebc6f361edd938211.sqlite")

def calculate_rsi(data, window=14):
    """Calculate the Relative Strength Index (RSI)"""
    delta = data['Close'].diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)
    
    # Calculate exponentially weighted moving average
    ema_up = up.ewm(com=window-1, adjust=False).mean()
    ema_down = down.ewm(com=window-1, adjust=False).mean()
    
    rs = ema_up / ema_down
    rsi = 100 - (100 / (1 + rs))
    return rsi.iloc[-1]

def analyze_alpha():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT symbol, sentiment_score FROM stocks")
        stocks = cursor.fetchall()
        
        if not stocks:
            print("[ALPHA] No stocks found. Run market_sync.py first.")
            return

        now = datetime.now().strftime('%Y-%m-%d %H:%M')
        print(f"\n[{now}] [ALPHA SCANNER] Crunching Predictive Models for {len(stocks)} symbols...", flush=True)

        for row in stocks:
            symbol, sentiment_score = row[0], row[1]
            try:
                print(f"  -> Scanning {symbol}...", end=" ", flush=True)
                
                # Fetch 60 days to ensure enough data for 20-day MA and 14-day RSI
                ticker = yf.Ticker(f"{symbol}.NS")
                hist = ticker.history(period="60d")
                
                if hist.empty or len(hist) < 20:
                    ticker = yf.Ticker(f"{symbol}.BO")
                    hist = ticker.history(period="60d")
                
                if not hist.empty and len(hist) >= 20:
                    # Calculate Technicals
                    rsi = calculate_rsi(hist)
                    current_volume = hist['Volume'].iloc[-1]
                    avg_volume_20d = hist['Volume'].tail(20).mean()
                    volume_spike = current_volume / avg_volume_20d if avg_volume_20d > 0 else 1
                    
                    # Logic Rules for Alpha Scanners
                    signal = "NONE"
                    confidence = 0.0
                    
                    # 1. Oversold Bounce (RSI very low + Positive/Neutral News)
                    if rsi < 35 and sentiment_score > -0.1:
                        signal = "OVERSOLD_BOUNCE"
                        # Closer to 0 RSI = higher confidence
                        confidence = min(round((40 - rsi) * 2.5 + (sentiment_score * 20), 1), 99.9)
                        
                    # 2. Breakout / Momentum Spike (High volume + Bullish News + Rising RSI)
                    elif volume_spike > 1.5 and rsi > 55 and rsi < 75 and sentiment_score > 0.1:
                        signal = "MOMENTUM_SPIKE"
                        confidence = min(round((volume_spike * 10) + (sentiment_score * 30) + 40, 1), 99.9)
                        
                    # 3. Overbought Reversion (RSI very high + Bearish/Neutral News)
                    elif rsi > 70 and sentiment_score < 0.1:
                        signal = "MEAN_REVERSION"
                        # Closer to 100 RSI = higher confidence
                        confidence = min(round((rsi - 65) * 2.5 - (sentiment_score * 20), 1), 99.9)
                        
                    # 4. Bearish Breakdown (Dumping volume + Bearish News)
                    elif volume_spike > 1.3 and rsi < 50 and sentiment_score < -0.1:
                        signal = "BEARISH_DUMP"
                        confidence = min(round((volume_spike * 15) - (sentiment_score * 40) + 30, 1), 99.9)

                    # Update Database
                    cursor.execute(
                        "UPDATE stocks SET ai_signal = ?, ai_confidence = ? WHERE symbol = ?",
                        (signal, confidence, symbol)
                    )
                    conn.commit()
                    
                    if signal != "NONE":
                        color = "\033[92m" if "BOUNCE" in signal or "MOMENTUM" in signal else "\033[91m"
                        print(f"[{color}{signal}\033[0m] Confidence: {confidence}% (RSI: {round(rsi, 1)}, Vol: {round(volume_spike, 1)}x)", flush=True)
                    else:
                        print("[\033[90mNO CLEAR SIGNAL\033[0m]", flush=True)
                else:
                    print("[\033[90mINSUFFICIENT DATA\033[0m]", flush=True)
                    
                time.sleep(0.5)

            except Exception as e:
                print(f"[\033[91mERROR\033[0m] {e}", flush=True)
                continue

        conn.close()
        print(f"\n[ALPHA SUCCESS] Predictive signals synced to Master Terminal.", flush=True)
        
    except Exception as e:
        print(f"\n[ALPHA CRITICAL ERROR] {e}", flush=True)

if __name__ == "__main__":
    analyze_alpha()
