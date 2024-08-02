import axios from "axios";

const API_URL = "https://stocksage-ai.onrender.com/api";
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