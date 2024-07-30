import yfinance as yf
import json
import sys

def fetch_nifty_stocks():
    nifty_stocks = {
        "Nifty50": [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS", "HINDUNILVR.NS", 
            "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS", "LT.NS", "HCLTECH.NS", 
            "ASIANPAINT.NS", "AXISBANK.NS", "MARUTI.NS", "BAJFINANCE.NS", "SUNPHARMA.NS", 
            "TITAN.NS", "WIPRO.NS", "NESTLEIND.NS", "ULTRACEMCO.NS", "NTPC.NS", "BAJAJFINSV.NS", 
            "POWERGRID.NS", "TECHM.NS", "ADANIENT.NS", "HDFCLIFE.NS", "JSWSTEEL.NS", "TATAMOTORS.NS", 
            "ADANIPORTS.NS", "ONGC.NS", "GRASIM.NS", "HINDALCO.NS", "M&M.NS", "SBILIFE.NS", 
            "DRREDDY.NS", "CIPLA.NS", "BAJAJ-AUTO.NS", "INDUSINDBK.NS", "BRITANNIA.NS", "EICHERMOT.NS", 
            "APOLLOHOSP.NS", "COALINDIA.NS", "TATASTEEL.NS", "UPL.NS", "DIVISLAB.NS", "HEROMOTOCO.NS", 
            "TATACONSUM.NS", "BPCL.NS", "LTIM.NS"
        ],
        "NiftyMidcap50": [
            "APLAPOLLO.NS", "ASTRAL.NS", "AUBANK.NS", "AUROPHARMA.NS", "BALKRISIND.NS", 
            "BANKINDIA.NS", "BATAINDIA.NS", "BEL.NS", "BHARATFORG.NS", "CANBK.NS", 
            "COFORGE.NS", "CONCOR.NS", "CUMMINSIND.NS", "ESCORTS.NS", "FEDERALBNK.NS", 
            "FORTIS.NS", "GODREJPROP.NS", "GUJGASLTD.NS", "HAL.NS", "HINDPETRO.NS", 
            "HONAUT.NS", "IDFCFIRSTB.NS", "INDHOTEL.NS", "INDIANB.NS", "INDIGO.NS", 
            "IRCTC.NS", "JUBLFOOD.NS", "LICHSGFIN.NS", "LUPIN.NS", "M&MFIN.NS", 
            "MFSL.NS", "MRF.NS", "MUTHOOTFIN.NS", "NMDC.NS", 
            "OBEROIRLTY.NS", "PFC.NS", "POLYCAB.NS", "RECLTD.NS", "SAIL.NS", 
            "SCHAEFFLER.NS", "SHRIRAMFIN.NS", "SRF.NS", "SUNTV.NS", "TATACOMM.NS", 
            "TATAPOWER.NS", "TORNTPHARM.NS", "TVSMOTOR.NS", "UNIONBANK.NS", "ZEEL.NS"
        ],
        "NiftySmallcap50": [
            "ABCAPITAL.NS", "ALKEM.NS", "ASHOKLEY.NS", "ATUL.NS", "BAYERCROP.NS", 
            "CGPOWER.NS", "CHAMBLFERT.NS", "CRISIL.NS", "CYIENT.NS", "DHANI.NS", 
            "EDELWEISS.NS", "EIHOTEL.NS", "EMAMILTD.NS", "FINEORG.NS", "GLENMARK.NS", 
            "GRINDWELL.NS", "GSPL.NS", "HAPPSTMNDS.NS", "HEG.NS", "HFCL.NS", 
            "IDFC.NS", "INDIGOPNTS.NS", "IRB.NS", "JKLAKSHMI.NS", "JKPAPER.NS", 
            "JSWENERGY.NS", "KAJARIACER.NS", "KPITTECH.NS", "LATENTVIEW.NS", "LXCHEM.NS", 
            "MAHABANK.NS", "MANAPPURAM.NS", "MOTILALOFS.NS", "NATCOPHARM.NS", "NBCC.NS", 
            "PNBHOUSING.NS", "RADICO.NS", "RAIN.NS", "RAJESHEXPO.NS", "REDINGTON.NS", 
            "RVNL.NS", "SAPPHIRE.NS", "SONATSOFTW.NS", "STARHEALTH.NS", "SUMICHEM.NS", 
            "SUZLON.NS", "TANLA.NS", "TEAMLEASE.NS", "TRITURBINE.NS", "ZENSARTECH.NS"
        ]
    }
    
    stocks_data = []
    
    for index_name, tickers in nifty_stocks.items():
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                history = stock.history(period="1d")
                current_price = history['Close'].iloc[-1] if not history.empty else None
                previous_close = info.get('previousClose')
                change_percentage = ((current_price - previous_close) / previous_close * 100) if current_price and previous_close else None
                
                stocks_data.append({
                    "symbol": ticker.split('.')[0],
                    "index": index_name,
                    "sector": info.get('sector', 'N/A'),
                    "price": round(current_price, 2) if current_price else 'N/A',
                    "changePercentage": round(change_percentage, 2) if change_percentage is not None else 'N/A'
                })
            except Exception as e:
                print(f"Error fetching data for {ticker}: {str(e)}", file=sys.stderr)
    
    return stocks_data

if __name__ == "__main__":
    try:
        result = fetch_nifty_stocks()
        print(json.dumps(result))
    except Exception as e:
        print(f"Error in main execution: {str(e)}", file=sys.stderr)
        print(json.dumps([]))  # Return an empty list in case of error