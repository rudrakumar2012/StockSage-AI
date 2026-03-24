import sqlite3
import yfinance as yf
import time
from datetime import datetime
import sys
import os
import signal

DB_PATH = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/cf484200e53006c67c54974dc28ae4e13cd5680de51b367ebc6f361edd938211.sqlite"

# Handle Node/Background termination signals gracefully
def handle_sigterm(*args):
    print("\n\n[SYSTEM] Termination signal received. Hard shutting down.", flush=True)
    os._exit(0)
signal.signal(signal.SIGTERM, handle_sigterm)

INDEX_MAP = {"^NSEI": "Nifty 50", "^BSESN": "BSE Sensex", "^NSMIDCP": "Midcap 150"}

SECTOR_MAP = {
    "RELIANCE": "Energy", "ONGC": "Energy", "TCS": "Technology", "INFY": "Technology",
    "HDFCBANK": "Financial Services", "ICICIBANK": "Financial Services", "ITC": "Consumer",
    "ZOMATO": "Consumer", "LT": "Infrastructure", "TATAMOTORS": "Automobile",
    "SUNPHARMA": "Healthcare", "TATASTEEL": "Metals", "JSWSTEEL": "Metals",
    "BHARTIARTL": "Telecommunications", "TITAN": "Consumer", "MARUTI": "Automobile",
    "HCLTECH": "Technology", "WIPRO": "Technology", "ASIANPAINT": "Consumer",
    "BAJFINANCE": "Financial Services", "ADANIENT": "Infrastructure"
}

STOCKS = [
    "RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "INFY", "SBIN", "ITC",
    "HINDUNILVR", "LT", "AXISBANK", "ZOMATO", "TATAMOTORS", "SUNPHARMA",
    "TATASTEEL", "JSWSTEEL", "BHARTIARTL", "TITAN", "MARUTI", "BAJFINANCE",
    "ADANIENT", "ADANIPORTS", "COALINDIA", "POWERGRID", "NTPC", "HCLTECH",
    "ASIANPAINT", "BAJAJFINSV", "WIPRO", "ULTRACEMCO", "KOTAKBANK", "ONGC",
    "M&M", "GRASIM", "TECHM", "HINDALCO", "CIPLA", "DRREDDY", "BRITANNIA",
    "INDUSINDBK", "EICHERMOT", "DIVISLAB", "APOLLOHOSP", "HEROMOTOCO",
    "BAJAJ-AUTO", "SHRIRAMFIN", "BPCL", "LTIM", "NESTLEIND",
    "HAL", "BEL", "PFC", "RECLTD", "GAIL", "BOSCHLTD", "TVSMOTOR",
    "INDIGO", "PIDILITIND", "TRENT", "VEDL", "HAVELLS", "AUBANK",
    "BANKBARODA", "PNB", "IOB", "UNIONBANK", "IDFCFIRSTB", "CANBK",
    "JINDALSTEL", "NMDC", "SAIL", "AMBUJACEM", "SHREECEM", "ACC",
    "DLF", "GODREJPROP", "LODHA", "PERSISTENT", "COFORGE", "MPHASIS",
    "POLYCAB", "DIXON", "KALYANKJIL", "ASTRAL", "CUMMINSIND", "ESCORTS",
    "MRF", "APOLLOTYRE", "MOTHERSON", "MAXHEALTH", "SYNGENE", "LAURUSLABS",
    "MUTHOOTFIN", "CHOLAFIN", "LICHSGFIN", "ICICIPRULI", "HDFCLIFE", "SBILIFE", 
    "PAYTM", "NYKAA", "POLICYBZR", "DELHIVERY", "JIOFIN", "RVNL", "IRFC", 
    "IREDA", "HUDCO", "NBCC", "SUZLON", "TATACOMM", "OFSS", "KPITTECH", "TATAELXSI"
]

def setup_db(conn, nuke=False):
    cursor = conn.cursor()
    if nuke:
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] [SYSTEM] Nuking old database tables...", flush=True)
        cursor.execute("DROP TABLE IF EXISTS indexes")
        cursor.execute("DROP TABLE IF EXISTS stocks")
        cursor.execute("DROP TABLE IF EXISTS sync_logs")
        
    cursor.execute("CREATE TABLE IF NOT EXISTS indexes (id INTEGER PRIMARY KEY AUTOINCREMENT, index_name TEXT NOT NULL UNIQUE, price REAL NOT NULL, change_percentage REAL NOT NULL)")
    cursor.execute("CREATE TABLE IF NOT EXISTS stocks (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, name TEXT NOT NULL, price REAL NOT NULL, change_percentage REAL NOT NULL, sector TEXT, sentiment_score REAL DEFAULT 0, sentiment_label TEXT DEFAULT 'NEUTRAL', ai_signal TEXT DEFAULT 'NONE', ai_confidence REAL DEFAULT 0)")
    cursor.execute("CREATE TABLE IF NOT EXISTS sync_logs (id INTEGER PRIMARY KEY, last_success TEXT, status TEXT)")
    conn.commit()

def sync_nse(is_startup=False):
    try:
        conn = sqlite3.connect(DB_PATH)
        setup_db(conn, nuke=is_startup)
        cursor = conn.cursor()
        now = datetime.now().strftime('%Y-%m-%d %H:%M')
        
        print(f"\n[{now}] [INIT] Fetching {len(STOCKS) + 3} Data Points. This will take ~2.5 minutes...", flush=True)
        cursor.execute("INSERT OR REPLACE INTO sync_logs (id, last_success, status) VALUES (1, ?, ?)", (now, "SYNCING"))
        conn.commit()

        def fetch_fresh_data(base_ticker, display_name, is_index=False):
            print(f"  -> Scanning {display_name}...", end=" ", flush=True)
            suffixes = [""] if is_index else [".NS", ".BO"]
            
            success = False
            last_error = ""
            
            for suffix in suffixes:
                try:
                    t = yf.Ticker(f"{base_ticker}{suffix}")
                    hist = t.history(period="5d")
                    
                    if not hist.empty and len(hist) >= 2:
                        curr = round(hist['Close'].iloc[-1], 2)
                        prev = hist['Close'].iloc[-2]
                        change = round(((curr - prev) / prev) * 100, 2)
                        
                        if is_index:
                            cursor.execute("INSERT OR REPLACE INTO indexes (index_name, price, change_percentage) VALUES (?, ?, ?)", (display_name, curr, change))
                        else:
                            sec = SECTOR_MAP.get(base_ticker, "NSE Equities")
                            # Use ON CONFLICT to update only price/change and preserve AI brain data
                            cursor.execute("""
                                INSERT INTO stocks (symbol, name, price, change_percentage, sector) 
                                VALUES (?, ?, ?, ?, ?)
                                ON CONFLICT(symbol) DO UPDATE SET 
                                    price = excluded.price,
                                    change_percentage = excluded.change_percentage,
                                    sector = excluded.sector
                            """, (base_ticker, base_ticker, curr, change, sec))
                        
                        print(f"[OK] ₹{curr} ({change}%)", flush=True)
                        success = True
                        break 
                    else:
                        last_error = "Empty dataset returned"
                
                except KeyboardInterrupt:
                    raise 
                except Exception as e:
                    last_error = str(e)
                    continue 
            
            if not success:
                # Now it will print WHY it failed (e.g., rate limit, connection error)
                print(f"[FAILED] {last_error}", flush=True)
                
            time.sleep(1.5)

        for tid, name in INDEX_MAP.items(): fetch_fresh_data(tid, name, True)
        for tid in STOCKS: fetch_fresh_data(tid, tid, False)

        cursor.execute("INSERT OR REPLACE INTO sync_logs (id, last_success, status) VALUES (1, ?, ?)", (now, "READY"))
        conn.commit()
        conn.close()
        print(f"\n[SUCCESS] Database locked and ready for UI rendering.", flush=True)
        
    except KeyboardInterrupt:
        print("\n\n[SYSTEM] Process killed by user (Ctrl+C). Hard shutting down.", flush=True)
        os._exit(0) 
    except Exception as e: 
        print(f"\n[CRITICAL ERROR] {e}", flush=True)

if __name__ == "__main__":
    try:
        sync_nse(is_startup=True) 
        while True:
            time.sleep(43200)
            sync_nse(is_startup=False)
    except KeyboardInterrupt:
        print("\n\n[SYSTEM] Background timer stopped by user.", flush=True)
        os._exit(0)