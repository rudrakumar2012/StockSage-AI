import yfinance as yf
import pandas as pd
import time
from datetime import datetime
import sys
import os

import sqlite3

# Use psycopg2 for PostgreSQL (Neon) if available
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

def analyze_alpha():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        p = get_placeholder()
        
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
                
                ticker = yf.Ticker(f"{symbol}.NS")
                hist = ticker.history(period="60d")
                
                if hist.empty or len(hist) < 20:
                    ticker = yf.Ticker(f"{symbol}.BO")
                    hist = ticker.history(period="60d")
                
                if not hist.empty and len(hist) >= 20:
                    # Clean data and calculate RSI
                    hist['Close'] = hist['Close'].ffill()
                    rsi = float(calculate_rsi(hist))
                    
                    current_volume = float(hist['Volume'].iloc[-1])
                    avg_volume_20d = float(hist['Volume'].tail(20).mean())
                    volume_spike = float(current_volume / avg_volume_20d if avg_volume_20d > 0 else 1)
                    
                    signal = "NONE"
                    confidence = 0.0
                    
                    # Logic for signals (relaxed slightly for better coverage)
                    if rsi < 38 and sentiment_score > -0.15:
                        signal = "OVERSOLD_BOUNCE"
                        confidence = float(min(round((40 - rsi) * 2.5 + (sentiment_score * 20), 1), 99.9))
                        
                    elif volume_spike > 1.4 and rsi > 50 and rsi < 78 and sentiment_score > 0.05:
                        signal = "MOMENTUM_SPIKE"
                        confidence = float(min(round((volume_spike * 10) + (sentiment_score * 30) + 35, 1), 99.9))
                        
                    elif rsi > 68 and sentiment_score < 0.15:
                        signal = "MEAN_REVERSION"
                        confidence = float(min(round((rsi - 65) * 2.5 - (sentiment_score * 20), 1), 99.9))
                        
                    elif volume_spike > 1.2 and rsi < 45 and sentiment_score < -0.05:
                        signal = "BEARISH_DUMP"
                        confidence = float(min(round((volume_spike * 15) - (sentiment_score * 40) + 25, 1), 99.9))
                    
                    # New: Trend following signal
                    elif rsi > 55 and rsi < 65 and sentiment_score > 0:
                        signal = "TRENDING_UP"
                        confidence = float(min(round(50 + (sentiment_score * 50), 1), 85.0))

                    cursor.execute(
                        f"UPDATE stocks SET ai_signal = {p}, ai_confidence = {p} WHERE symbol = {p}",
                        (signal, confidence, symbol)
                    )
                    conn.commit()
                    
                    color = "\033[92m" if signal != "NONE" and ("UP" in signal or "BOUNCE" in signal or "MOMENTUM" in signal) else "\033[91m" if signal != "NONE" else "\033[90m"
                    print(f"[{color}{signal}\033[0m] RSI: {round(rsi,1)}, Vol: {round(volume_spike,1)}x, Sent: {sentiment_score}", flush=True)
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
