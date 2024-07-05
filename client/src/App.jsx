import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchNifty50Data } from "./api/stockService";

function App() {
  const [nifty50Data, setNifty50Data] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNifty50Stocks();
  }, []);

  const fetchNifty50Stocks = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNifty50Data();
      setNifty50Data(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Nifty 50 Stocks</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="stock-grid">
        {nifty50Data.map((stock) => (
          <div key={stock.symbol} className="stock-item">
            <span className="symbol">{stock.symbol}</span>
            <span className="sector">{stock.sector}</span>
            <span className="price">₹{stock.price}</span>
            <span
              className={`change ${
                stock.changePercentage > 0 ? "positive" : "negative"
              }`}
            >
              {stock.changePercentage > 0 ? "+" : ""}
              {stock.changePercentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
