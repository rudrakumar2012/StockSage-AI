import yfinance as yf
import time
from datetime import datetime
import sys
import os
import signal

import sqlite3

# Use psycopg2 for PostgreSQL (Neon) if available
try:
    import psycopg2
    from psycopg2.extras import execute_values
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
    is_pg = DATABASE_URL and HAS_POSTGRES
    
    if nuke:
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] [SYSTEM] Nuking old database tables...", flush=True)
        cursor.execute("DROP TABLE IF EXISTS indexes")
        cursor.execute("DROP TABLE IF EXISTS stocks")
        cursor.execute("DROP TABLE IF EXISTS sync_logs")
        cursor.execute("DROP TABLE IF EXISTS users")
        
    if is_pg:
        cursor.execute("CREATE TABLE IF NOT EXISTS indexes (id SERIAL PRIMARY KEY, index_name TEXT NOT NULL UNIQUE, price DOUBLE PRECISION NOT NULL, change_percentage DOUBLE PRECISION NOT NULL)")
        cursor.execute("CREATE TABLE IF NOT EXISTS stocks (id SERIAL PRIMARY KEY, symbol TEXT NOT NULL UNIQUE, name TEXT NOT NULL, price DOUBLE PRECISION NOT NULL, change_percentage DOUBLE PRECISION NOT NULL, sector TEXT, sentiment_score DOUBLE PRECISION DEFAULT 0, sentiment_label TEXT DEFAULT 'NEUTRAL', ai_signal TEXT DEFAULT 'NONE', ai_confidence DOUBLE PRECISION DEFAULT 0)")
        cursor.execute("CREATE TABLE IF NOT EXISTS sync_logs (id SERIAL PRIMARY KEY, last_success TEXT, status TEXT)")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                subscription_tier TEXT DEFAULT 'FREE',
                razorpay_customer_id TEXT,
                subscription_expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
    else:
        cursor.execute("CREATE TABLE IF NOT EXISTS indexes (id INTEGER PRIMARY KEY AUTOINCREMENT, index_name TEXT NOT NULL UNIQUE, price REAL NOT NULL, change_percentage REAL NOT NULL)")
        cursor.execute("CREATE TABLE IF NOT EXISTS stocks (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, name TEXT NOT NULL, price REAL NOT NULL, change_percentage REAL NOT NULL, sector TEXT, sentiment_score REAL DEFAULT 0, sentiment_label TEXT DEFAULT 'NEUTRAL', ai_signal TEXT DEFAULT 'NONE', ai_confidence REAL DEFAULT 0)")
        cursor.execute("CREATE TABLE IF NOT EXISTS sync_logs (id INTEGER PRIMARY KEY, last_success TEXT, status TEXT)")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                subscription_tier TEXT DEFAULT 'FREE',
                razorpay_customer_id TEXT,
                subscription_expiry INTEGER,
                created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
                updated_at INTEGER DEFAULT CURRENT_TIMESTAMP
            )
        """)
    conn.commit()

def sync_nse(is_startup=False):
    try:
        conn = get_connection()
        setup_db(conn, nuke=is_startup)
        cursor = conn.cursor()
        now = datetime.now().strftime('%Y-%m-%d %H:%M')
        p = get_placeholder()
        is_pg = DATABASE_URL and HAS_POSTGRES
        
        print(f"\n[{now}] [INIT] Fetching {len(STOCKS) + 3} Data Points. This will take ~2.5 minutes...", flush=True)
        
        if is_pg:
            cursor.execute("INSERT INTO sync_logs (id, last_success, status) VALUES (1, %s, %s) ON CONFLICT (id) DO UPDATE SET last_success = EXCLUDED.last_success, status = EXCLUDED.status", (now, "SYNCING"))
        else:
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
                        curr = float(round(hist['Close'].iloc[-1], 2))
                        prev = float(hist['Close'].iloc[-2])
                        change = float(round(((curr - prev) / prev) * 100, 2))
                        
                        if is_index:
                            if is_pg:
                                cursor.execute("INSERT INTO indexes (index_name, price, change_percentage) VALUES (%s, %s, %s) ON CONFLICT (index_name) DO UPDATE SET price = EXCLUDED.price, change_percentage = EXCLUDED.change_percentage", (display_name, curr, change))
                            else:
                                cursor.execute("INSERT OR REPLACE INTO indexes (index_name, price, change_percentage) VALUES (?, ?, ?)", (display_name, curr, change))
                        else:
                            sec = SECTOR_MAP.get(base_ticker, "NSE Equities")
                            if is_pg:
                                cursor.execute("""
                                    INSERT INTO stocks (symbol, name, price, change_percentage, sector) 
                                    VALUES (%s, %s, %s, %s, %s)
                                    ON CONFLICT(symbol) DO UPDATE SET 
                                        price = EXCLUDED.price,
                                        change_percentage = EXCLUDED.change_percentage,
                                        sector = EXCLUDED.sector
                                """, (base_ticker, base_ticker, curr, change, sec))
                            else:
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
                print(f"[FAILED] {last_error}", flush=True)
                
            time.sleep(1.2)

        for tid, name in INDEX_MAP.items(): fetch_fresh_data(tid, name, True)
        for tid in STOCKS: fetch_fresh_data(tid, tid, False)

        if is_pg:
            cursor.execute("INSERT INTO sync_logs (id, last_success, status) VALUES (1, %s, %s) ON CONFLICT (id) DO UPDATE SET last_success = EXCLUDED.last_success, status = EXCLUDED.status", (now, "READY"))
        else:
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
    sync_nse(is_startup=True)
