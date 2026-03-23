import sqlite3
import yfinance as yf
import time
from datetime import datetime

DB_PATH = "local.db"
FETCH_INTERVAL = 600 # 10 Minutes

# Comprehensive Sector Map
SECTOR_MAP = {
    "RELIANCE": "Energy", "ONGC": "Energy", "TCS": "Technology", "INFY": "Technology",
    "HDFCBANK": "Financial Services", "ICICIBANK": "Financial Services", "ITC": "Consumer",
    "ZOMATO": "Consumer", "LT": "Infrastructure", "TATAMOTORS": "Automobile",
    "SUNPHARMA": "Healthcare", "TATASTEEL": "Metals", "JSWSTEEL": "Metals",
    "BHARTIARTL": "Telecommunications", "TITAN": "Consumer", "MARUTI": "Automobile"
}

# Verified Tickers
STOCKS = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS", "SBIN.NS", "ITC.NS",
    "HINDUNILVR.NS", "LT.NS", "AXISBANK.NS", "ZOMATO.NS", "TATAMOTORS.NS", "SUNPHARMA.NS",
    "TATASTEEL.NS", "JSWSTEEL.NS", "BHARTIARTL.NS", "TITAN.NS", "MARUTI.NS", "BAJFINANCE.NS",
    "ADANIENT.NS", "ADANIPORTS.NS", "COALINDIA.NS", "POWERGRID.NS", "NTPC.NS"
]

def setup_db(conn):
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS indexes (id INTEGER PRIMARY KEY AUTOINCREMENT, index_name TEXT NOT NULL UNIQUE, price REAL NOT NULL, change_percentage REAL NOT NULL)")
    cursor.execute("CREATE TABLE IF NOT EXISTS stocks (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, name TEXT NOT NULL, price REAL NOT NULL, change_percentage REAL NOT NULL, sector TEXT)")
    cursor.execute("CREATE TABLE IF NOT EXISTS sync_logs (id INTEGER PRIMARY KEY, last_success TEXT, status TEXT)")
    conn.commit()

def sync_nse():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        now = datetime.now().strftime('%H:%M:%S')
        
        # Heartbeat: SYNCING
        cursor.execute("INSERT OR REPLACE INTO sync_logs (id, last_success, status) VALUES (1, ?, ?)", (now, "SYNCING"))
        conn.commit()

        # Update Indexes & Stocks
        for ticker_symbol in STOCKS: # Same loop for Indexes too
            try:
                t = yf.Ticker(ticker_symbol)
                # METHOD 1: Pull official live data from .info
                live_data = t.info
                current_price = live_data.get('regularMarketPrice')
                change_pct = live_data.get('regularMarketChangePercent')

                # METHOD 2: Fallback if .info is empty (Calculates from Prev Close)
                if current_price is None or change_pct is None:
                    hist = t.history(period="2d")
                    if len(hist) >= 2:
                        current_price = hist['Close'].iloc[-1]
                        prev_close = hist['Close'].iloc[-2]
                        change_pct = ((current_price - prev_close) / prev_close) * 100

                if current_price:
                    sym = ticker_symbol.replace(".NS", "")
                    sec = SECTOR_MAP.get(sym, "Infrastructure")
                    cursor.execute("INSERT OR REPLACE INTO stocks (symbol, name, price, change_percentage, sector) VALUES (?, ?, ?, ?, ?)", 
                                   (sym, sym, round(current_price, 2), round(change_pct, 2), sec))
                
                time.sleep(0.5) # Safety delay
            except: continue

        # Heartbeat: IDLE
        cursor.execute("INSERT OR REPLACE INTO sync_logs (id, last_success, status) VALUES (1, ?, ?)", (now, "IDLE"))
        conn.commit()
        conn.close()
    except Exception as e: print(f"Sync Error: {e}")