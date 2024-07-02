import React, { useState, useEffect } from 'react';
import './App.css';

// Import the fetchNifty50Data function from your service file
import { fetchNifty50Data } from '../../stockService'; // Adjust the path as per your file structure

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
      const data = await fetchNifty50Data(); // Call fetchNifty50Data function
      setNifty50Data(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Nifty 50 Stocks</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {nifty50Data.map((stock) => (
          <li key={stock.symbol}>
            <strong>{stock.symbol}</strong>: {stock.name} - {stock.sector}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
