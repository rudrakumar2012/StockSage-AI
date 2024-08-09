import React, { useState, useEffect } from "react";
import { fetchStockData, fetchIndexData } from "../api/stockService";

const Dashboard = () => {
  const [stockData, setStockData] = useState({});
  const [indexData, setIndexData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockResponse = await fetchStockData();
        const indexResponse = await fetchIndexData();
        const groupedStockData = stockResponse.reduce((acc, stock) => {
          if (!acc[stock.index_name]) {
            acc[stock.index_name] = [];
          }
          acc[stock.index_name].push(stock);
          return acc;
        }, {});
        setStockData(groupedStockData);
        setIndexData(indexResponse);
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

  const indices = Object.keys(stockData);

  const filteredStocks = selectedIndex === "All"
    ? Object.values(stockData).flat()
    : stockData[selectedIndex] || [];

  const formatNumber = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(2);
    }
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return parseFloat(value).toFixed(2);
    }
    return 'N/A';
  };

  return (
    <div className="container my-5">
      <h1 className="display-6 text-center pt-3">Stock Market Data</h1>
      <div className="row">
        <div className="col-md-4">
          <h4>Indices:</h4>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <button
                className={`btn btn-link ${selectedIndex === "All" ? "fw-bold" : ""}`}
                onClick={() => setSelectedIndex("All")}
              >
                All
              </button>
            </li>
            {indices.map((index) => {
              const indexInfo = indexData.find(i => i.index_name === index) || {};
              return (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <button
                    className={`btn btn-link ${selectedIndex === index ? "fw-bold" : ""}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    {index}
                  </button>
                  <div className="text-end">
                    <div>{formatNumber(indexInfo.price)}</div>
                    <div className={parseFloat(indexInfo.change_percentage) > 0 ? "text-success" : "text-danger"}>
                      {formatNumber(indexInfo.change_percentage)}%
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-md-8">
          <h4>Stock Data:</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Index</th>
                <th>Sector</th>
                <th>Price (₹)</th>
                <th>Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.index_name}</td>
                  <td>{stock.sector}</td>
                  <td>{formatNumber(stock.price)}</td>
                  <td className={parseFloat(stock.change_percentage) > 0 ? "text-success" : "text-danger"}>
                    {formatNumber(stock.change_percentage)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;