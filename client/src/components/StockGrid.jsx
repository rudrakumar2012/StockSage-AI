import React from "react";

function StockGrid({ stocks }) {
  if (!stocks || stocks.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="stock-grid">
      {stocks.map((stock) => (
        <div key={stock.id} className="stock-item">
          <span className="symbol">{stock.symbol}</span>
          <span className="sector">{stock.sector}</span>
          <span className="price">₹{stock.price}</span>
          <span
            className={`change ${
              stock.change_percentage > 0 ? "positive" : "negative"
            }`}
          >
            {stock.change_percentage > 0 ? "+" : ""}
            {stock.change_percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default StockGrid;
