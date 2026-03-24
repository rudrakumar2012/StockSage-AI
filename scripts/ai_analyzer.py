import sqlite3
import yfinance as yf
import time
from datetime import datetime
import sys
import os
import signal
try:
    import nltk
    # We use Vader because it's specifically tuned for news/social media
    # TextBlob often sees financial headlines as 0.0 (too objective).
    from nltk.sentiment.vader import SentimentIntensityAnalyzer
    
    # Download the Vader lexicon silently if missing
    try:
        nltk.data.find('sentiment/vader_lexicon.zip')
    except LookupError:
        print("[AI] Downloading Vader lexicon for the first time...")
        nltk.download('vader_lexicon', quiet=True)
        
    sia = SentimentIntensityAnalyzer()
except ImportError:
    print("[ERROR] 'nltk' not found. Please run: pip install nltk")
    sys.exit(1)

DB_PATH = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/cf484200e53006c67c54974dc28ae4e13cd5680de51b367ebc6f361edd938211.sqlite"

# Handle termination signals gracefully
def handle_sigterm(*args):
    print("\n\n[AI] Termination signal received. Shutting down.", flush=True)
    os._exit(0)
signal.signal(signal.SIGTERM, handle_sigterm)

def get_sentiment_label(score):
    # Vader compound score ranges from -1 to 1
    # Financial headlines are subtle, so we use a lower threshold
    if score >= 0.05: return "BULLISH"
    if score <= -0.05: return "BEARISH"
    return "NEUTRAL"

def analyze_stocks():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
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
                    for article in news[:5]: # Top 5 headlines
                        # yfinance news structure typically nests title/summary under 'content'
                        content = article.get('content', {})
                        title = content.get('title', '')
                        summary = content.get('summary', '')
                        
                        # Use Vader's compound score on both title and summary for better context
                        full_text = f"{title}. {summary}"
                        sentiment = sia.polarity_scores(full_text)
                        scores.append(sentiment['compound'])
                    
                    # Calculate average compound score
                    avg_score = sum(scores) / len(scores) if scores else 0
                    label = get_sentiment_label(avg_score)
                    
                    cursor.execute(
                        "UPDATE stocks SET sentiment_score = ?, sentiment_label = ? WHERE symbol = ?",
                        (round(avg_score, 3), label, symbol)
                    )
                    conn.commit()
                    
                    # Format color in terminal output based on label
                    color = "\033[92m" if label == "BULLISH" else "\033[91m" if label == "BEARISH" else "\033[93m"
                    reset = "\033[0m"
                    print(f"[{color}{label}{reset}] Score: {round(avg_score, 3)}", flush=True)
                else:
                    print("[\033[90mNO NEWS\033[0m] Skipping.", flush=True)
                
                # Small delay to avoid aggressive rate limiting
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
