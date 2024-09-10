import axios from "axios";

const API_URL = "http://localhost:5000/api";
//https://stocksage-ai.onrender.com/api


export const fetchStockData = async () => {
  try {
    const response = await axios.get(`${API_URL}/stocks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

export const fetchIndexData = async () => {
  try {
    const response = await axios.get(`${API_URL}/indexes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching index data:", error);
    throw error;
  }
};