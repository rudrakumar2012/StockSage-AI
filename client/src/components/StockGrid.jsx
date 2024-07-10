import React from "react";

function StockGrid({ stocks }) {
  return (
    <div className="stock-grid">
      {stocks.map((stock) => (
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
  );
}

export default StockGrid;
