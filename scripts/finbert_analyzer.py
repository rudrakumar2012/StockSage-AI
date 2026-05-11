"""
FinBERT Financial Sentiment Analyzer

Replaces VADER with ProsusAI/finbert — a BERT model fine-tuned on financial text.
Outputs: sentiment_score (signed probability), sentiment_label (BULLISH/BEARISH/NO_DATA)

If no news articles are found for a stock, sentiment_label is set to NO_DATA
and sentiment_score is set to NULL (0 in SQLite). This prevents signals from
firing on stocks with no sentiment information.
"""

import yfinance as yf
import time
from datetime import datetime
import os
import signal

import sqlite3

try:
    import psycopg2
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
    HAS_FINBERT = True
except ImportError:
    HAS_FINBERT = False
    print("[FINBERT ERROR] transformers/torch not found. Run: pip install transformers torch")
    import sys
    sys.exit(1)

DATABASE_URL = os.environ.get("DATABASE_URL")
DB_PATH = os.environ.get("DB_PATH", "local_market.db")

# Load FinBERT model once at module level
MODEL_NAME = "ProsusAI/finbert"
print(f"[FINBERT] Loading model {MODEL_NAME}...", flush=True)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()
print("[FINBERT] Model loaded.", flush=True)


def get_connection():
    if DATABASE_URL and HAS_POSTGRES:
        return psycopg2.connect(DATABASE_URL)
    else:
        if not HAS_POSTGRES and DATABASE_URL:
            print("[WARNING] DATABASE_URL found but psycopg2 not installed. Falling back to SQLite.")
        return sqlite3.connect(DB_PATH)


def get_placeholder():
    return "%s" if DATABASE_URL and HAS_POSTGRES else "?"


def handle_sigterm(*args):
    print("\n\n[FINBERT] Termination signal received. Shutting down.", flush=True)
    os._exit(0)


signal.signal(signal.SIGTERM, handle_sigterm)


def analyze_sentiment_batch(texts):
    """
    Run FinBERT on a batch of texts.
    Returns list of dicts: {label: 'BULLISH'|'BEARISH'|'NEUTRAL', score: float}
    The score is the probability of the predicted label.
    """
    if not texts:
        return []

    results = []
    for text in texts:
        if not text or not text.strip():
            results.append({"label": "NEUTRAL", "score": 0.0})
            continue

        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)

        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)[0]
        # FinBERT label order: ['positive', 'negative', 'neutral']
        labels_map = {0: "positive", 1: "negative", 2: "neutral"}
        pred_idx = torch.argmax(probs).item()
        pred_label = labels_map[pred_idx]
        pred_score = probs[pred_idx].item()

        results.append({"label": pred_label, "score": pred_score})

    return results


def to_db_label_score(finbert_results):
    """
    Convert FinBERT results to DB-compatible label and score.

    Label mapping:
      positive with probability > 0.5 → BULLISH, score = +probability
      negative with probability > 0.5 → BEARISH, score = -probability
      otherwise → NEUTRAL, score = 0.0

    The 0.5 threshold means we only label something BULLISH/BEARISH when
    FinBERT is at least 50% confident in that direction.
    """
    if not finbert_results:
        return "NO_DATA", 0.0

    # Average the scores across all articles
    pos_scores = [r["score"] for r in finbert_results if r["label"] == "positive"]
    neg_scores = [r["score"] for r in finbert_results if r["label"] == "negative"]
    neu_scores = [r["score"] for r in finbert_results if r["label"] == "neutral"]

    total = len(finbert_results)
    avg_pos = sum(pos_scores) / total if total > 0 else 0.0
    avg_neg = sum(neg_scores) / total if total > 0 else 0.0
    avg_neu = sum(neu_scores) / total if total > 0 else 0.0

    # Determine dominant sentiment
    if avg_pos > avg_neg and avg_pos > avg_neu and avg_pos > 0.5:
        return "BULLISH", round(avg_pos, 3)
    elif avg_neg > avg_pos and avg_neg > avg_neu and avg_neg > 0.5:
        return "BEARISH", round(-avg_neg, 3)
    else:
        return "NEUTRAL", 0.0


def analyze_stocks():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        p = get_placeholder()

        cursor.execute("SELECT symbol FROM stocks")
        stocks = [row[0] for row in cursor.fetchall()]

        if not stocks:
            print("[FINBERT] No stocks found in database. Run market_sync.py first.")
            return

        now = datetime.now().strftime('%Y-%m-%d %H:%M')
        print(f"\n[{now}] [FINBERT ENGINE] Starting Financial NLP Analysis for {len(stocks)} symbols...", flush=True)

        for symbol in stocks:
            try:
                print(f"  -> Analyzing {symbol} news...", end=" ", flush=True)

                ticker = yf.Ticker(f"{symbol}.NS")
                news = ticker.news

                if not news:
                    ticker = yf.Ticker(f"{symbol}.BO")
                    news = ticker.news

                if news:
                    texts = []
                    for article in news[:5]:
                        content = article.get('content', {})
                        title = content.get('title', '') if isinstance(content, dict) else ''
                        summary = content.get('summary', '') if isinstance(content, dict) else ''

                        # Fallback: some yfinance versions use different structure
                        if not title and isinstance(article, dict):
                            title = article.get('title', '')
                        if not summary and isinstance(article, dict):
                            summary = article.get('summary', '')

                        full_text = f"{title}. {summary}".strip()
                        if full_text and full_text != ".":
                            texts.append(full_text)

                    if texts:
                        results = analyze_sentiment_batch(texts)
                        label, score = to_db_label_score(results)

                        cursor.execute(
                            f"UPDATE stocks SET sentiment_score = {p}, sentiment_label = {p} WHERE symbol = {p}",
                            (score, label, symbol)
                        )
                        conn.commit()

                        color = "\033[92m" if label == "BULLISH" else "\033[91m" if label == "BEARISH" else "\033[93m"
                        reset = "\033[0m"
                        print(f"[{color}{label}{reset}] Score: {score} ({len(texts)} articles)", flush=True)
                    else:
                        # No usable text from news articles
                        cursor.execute(
                            f"UPDATE stocks SET sentiment_score = {p}, sentiment_label = {p} WHERE symbol = {p}",
                            (0, "NO_DATA", symbol)
                        )
                        conn.commit()
                        print("[\033[90mNO DATA\033[0m] No usable text from articles.", flush=True)
                else:
                    # No news at all for this stock
                    cursor.execute(
                        f"UPDATE stocks SET sentiment_score = {p}, sentiment_label = {p} WHERE symbol = {p}",
                        (0, "NO_DATA", symbol)
                    )
                    conn.commit()
                    print("[\033[90mNO DATA\033[0d] No news found.", flush=True)

                time.sleep(0.5)

            except Exception as e:
                print(f"[\033[91mERROR\033[0m] {e}", flush=True)
                continue

        conn.close()
        print(f"\n[FINBERT SUCCESS] Financial sentiment data synced to Master Terminal.", flush=True)

    except Exception as e:
        print(f"\n[FINBERT CRITICAL ERROR] {e}", flush=True)


if __name__ == "__main__":
    analyze_stocks()