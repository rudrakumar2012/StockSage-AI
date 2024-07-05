import yfinance as yf
import json
import sys

def fetch_nifty50_stocks():
    nifty50_tickers = [
        "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "HINDUNILVR.NS",
        "ICICIBANK.NS", "ICICIBANK.NS", "KOTAKBANK.NS", "BHARTIARTL.NS", "ITC.NS",
        "LT.NS", "SBIN.NS", "BAJFINANCE.NS", "HCLTECH.NS", "ASIANPAINT.NS",
        "MARUTI.NS", "AXISBANK.NS", "WIPRO.NS", "ULTRACEMCO.NS", "NESTLEIND.NS",
        "TATAMOTORS.NS", "SUNPHARMA.NS", "ONGC.NS", "TITAN.NS", "NTPC.NS"
    ]
    stocks_data = []
    for ticker in nifty50_tickers:
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            history = stock.history(period="1d")
            current_price = history['Close'].iloc[-1] if not history.empty else None
            previous_close = info.get('previousClose')
            change_percentage = ((current_price - previous_close) / previous_close * 100) if current_price and previous_close else None
            
            stocks_data.append({
                "symbol": ticker.split('.')[0],
                "sector": info.get('sector', 'N/A'),
                "price": round(current_price, 2) if current_price else 'N/A',
                "changePercentage": round(change_percentage, 2) if change_percentage is not None else 'N/A'
            })
        except Exception as e:
            print(f"Error fetching data for {ticker}: {str(e)}", file=sys.stderr)
    return stocks_data

if __name__ == "__main__":
    try:
        result = fetch_nifty50_stocks()
        print(json.dumps(result))
    except Exception as e:
        print(f"Error in main execution: {str(e)}", file=sys.stderr)
        print(json.dumps([]))  # Return an empty list in case of error