import yfinance as yf
import json

def fetch_nifty50_stocks():
    try:
        nifty50_tickers = [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "HINDUNILVR.NS", # add more symbols here
            # You should add all Nifty 50 stocks symbols here
        ]
        stocks_data = []
        for ticker in nifty50_tickers:
            stock = yf.Ticker(ticker)
            info = stock.info
            stocks_data.append({
                "symbol": ticker.split('.')[0],
                "name": info['shortName'],
                "sector": info.get('sector', 'N/A'),
                "marketCap": info.get('marketCap', 'N/A')
            })
        return stocks_data
    except Exception as e:
        print(f"Error fetching Nifty 50 stocks data: {str(e)}")
        return []

if __name__ == "__main__":
    result = fetch_nifty50_stocks()
    print(json.dumps(result))
