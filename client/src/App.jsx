import React, { useState, useEffect } from "react";
import { fetchNifty50Data } from "./api/stockService";
import StockGrid from "./components/StockGrid";

function App() {
  const [nifty50Data, setNifty50Data] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNifty50Stocks(); // Fetch initial data
    const interval = setInterval(fetchNifty50Stocks, 5000); // Polling interval in milliseconds (e.g., every 5 seconds)

    return () => clearInterval(interval); // Cleanup function to clear interval on unmount
  }, []);

  const fetchNifty50Stocks = async () => {
    try {
      const freshData = await fetchNifty50Data();
      setNifty50Data(freshData);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setError(error.message || "Failed to fetch Nifty 50 data");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Nifty 50 Stocks</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {nifty50Data.length > 0 && <StockGrid stocks={nifty50Data} />}
    </div>
  );
}

export default App;
