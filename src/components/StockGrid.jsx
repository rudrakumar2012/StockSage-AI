import React, { useState, useEffect } from "react";
import { fetchNifty50Data } from "../api/stockService";

const StockGrid = () => {
  const [nifty50Data, setNifty50Data] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNifty50Data();
        setNifty50Data(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch Nifty 50 data");
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

  if (nifty50Data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <>
      <p className="display-6 text-center pt-3">Nifty-50</p>
      <div className="container my-5 border rounded-3">
        <div>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">Sector</th>
                <th scope="col">Price (₹)</th>
                <th scope="col">Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {nifty50Data.map((stock) => (
                <tr key={stock.id}>
                  <td>{stock.symbol}</td>
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
    </>
  );
};

export default StockGrid;
