import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchNifty50Data } from "./api/stockService";
import StockGrid from "./components/StockGrid";

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
      <StockGrid stocks={nifty50Data} />
    </div>
  );
}

export default App;
