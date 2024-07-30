import React, { useState, useEffect } from "react";
import { fetchStockData } from "../api/stockService";

const StockGrid = () => {
  const [stockData, setStockData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStockData();
        const groupedData = data.reduce((acc, stock) => {
          if (!acc[stock.index]) {
            acc[stock.index] = [];
          }
          acc[stock.index].push(stock);
          return acc;
        }, {});
        setStockData(groupedData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch stock data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (Object.keys(stockData).length === 0) {
    return <div>No data available</div>;
  }

  const indices = ["All", "Nifty 50", "Nifty Mid Cap 50", "Nifty Small Cap 50"];

  const filteredStocks = selectedIndex === "All"
    ? Object.values(stockData).flat()
    : stockData[selectedIndex] || [];

  return (
    <div className="container my-5">
      <h1 className="display-6 text-center pt-3">Stock Market Data</h1>
      <div className="mb-3">
        <label htmlFor="indexSelect" className="form-label">Select Index:</label>
        <select
          id="indexSelect"
          className="form-select"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
        >
          {indices.map((index) => (
            <option key={index} value={index}>{index}</option>
          ))}
        </select>
      </div>
      <div className="border rounded-3">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Symbol</th>
              <th scope="col">Index</th>
              <th scope="col">Sector</th>
              <th scope="col">Price (₹)</th>
              <th scope="col">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.index}</td>
                <td>{stock.sector}</td>
                <td>{stock.price}</td>
                <td
                  className={
                    stock.change_percentage > 0
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {stock.change_percentage > 0 ? "+" : ""}
                  {stock.change_percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockGrid;