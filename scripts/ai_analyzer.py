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
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

try:
    import nltk
    from nltk.sentiment.vader import SentimentIntensityAnalyzer
    
    try:
        nltk.data.find('sentiment/vader_lexicon.zip')
    except LookupError:
        print("[AI] Downloading Vader lexicon for the first time...")
        nltk.download('vader_lexicon', quiet=True)
        
    sia = SentimentIntensityAnalyzer()
except ImportError:
    print("[ERROR] 'nltk' not found. Please run: pip install nltk")
    sys.exit(1)

DATABASE_URL = os.environ.get("DATABASE_URL")
DB_PATH = os.environ.get("DB_PATH", "local_market.db")

def get_connection():
    if DATABASE_URL and HAS_POSTGRES:
        return psycopg2.connect(DATABASE_URL)
    else:
        return sqlite3.connect(DB_PATH)

def get_placeholder():
    return "%s" if DATABASE_URL and HAS_POSTGRES else "?"

# Handle termination signals gracefully
def handle_sigterm(*args):
    print("\n\n[AI] Termination signal received. Shutting down.", flush=True)
    os._exit(0)
signal.signal(signal.SIGTERM, handle_sigterm)

def get_sentiment_label(score):
    if score >= 0.05: return "BULLISH"
    if score <= -0.05: return "BEARISH"
    return "NEUTRAL"

def analyze_stocks():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        p = get_placeholder()
        
        # Get all stocks from the DB
        cursor.execute("SELECT symbol FROM stocks")
        stocks = [row[0] for row in cursor.fetchall()]
        
        if not stocks:
            print("[AI] No stocks found in database. Run market_sync.py first.")
            return

        now = datetime.now().strftime('%Y-%m-%d %H:%M')
        print(f"\n[{now}] [AI ENGINE] Starting VADER Sentiment Analysis for {len(stocks)} symbols...", flush=True)

        for symbol in stocks:
            try:
                print(f"  -> Analyzing {symbol} news...", end=" ", flush=True)
                
                ticker = yf.Ticker(f"{symbol}.NS")
                news = ticker.news
                
                if not news:
                    ticker = yf.Ticker(f"{symbol}.BO")
                    news = ticker.news

                if news:
                    scores = []
                    for article in news[:5]:
                        content = article.get('content', {})
                        title = content.get('title', '')
                        summary = content.get('summary', '')
                        
                        full_text = f"{title}. {summary}"
                        sentiment = sia.polarity_scores(full_text)
                        scores.append(sentiment['compound'])
                    
                    avg_score = float(sum(scores) / len(scores) if scores else 0)
                    label = get_sentiment_label(avg_score)
                    
                    cursor.execute(
                        f"UPDATE stocks SET sentiment_score = {p}, sentiment_label = {p} WHERE symbol = {p}",
                        (round(avg_score, 3), label, symbol)
                    )
                    conn.commit()
                    
                    color = "\033[92m" if label == "BULLISH" else "\033[91m" if label == "BEARISH" else "\033[93m"
                    reset = "\033[0m"
                    print(f"[{color}{label}{reset}] Score: {round(avg_score, 3)} ({len(scores)} articles)", flush=True)
                else:
                    print("[\033[90mNO NEWS\033[0m] Skipping.", flush=True)
                
                time.sleep(0.5)

            except Exception as e:
                print(f"[\033[91mERROR\033[0m] {e}", flush=True)
                continue

        conn.close()
        print(f"\n[AI SUCCESS] VADER sentiment data synced to Master Terminal.", flush=True)
        
    except Exception as e:
        print(f"\n[AI CRITICAL ERROR] {e}", flush=True)

if __name__ == "__main__":
    analyze_stocks()
