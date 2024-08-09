import React, { useState, useEffect } from "react";
import { fetchStockData, fetchIndexData } from "../api/stockService";
import Heatmap from "react-heatmap";

const StockGrid = () => {
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
          if (!acc[stock.index]) {
            acc[stock.index] = [];
          }
          acc[stock.index].push(stock);
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

  const heatmapData = filteredStocks.map((stock) => [
    stock.symbol,
    stock.price,
    stock.change_percentage,
  ]);

  return (
    <div className="container my-5">
      <h1 className="display-6 text-center pt-3">Stock Market Data</h1>
      <div className="row">
        <div className="col-md-3">
          <h4>Indices:</h4>
          <ul>
            {indices.map((index) => (
              <li key={index}>
                <button
                  className={`btn btn-secondary ${selectedIndex === index ? "active" : ""}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  {index}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-9">
          <Heatmap
            data={heatmapData}
            xLabels={["Symbol", "Price (₹)", "Change (%)"]}
            yLabels={filteredStocks.map((stock) => stock.symbol)}
            cellStyle={(x, y) => {
              if (x === 2) {
                return {
                  background: filteredStocks[y].change_percentage > 0 ? "green" : "red",
                };
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StockGrid;