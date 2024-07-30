import axios from "axios";

const api_url = process.env.API_URL;

export const fetchStockData = async () => {
  try {
    const response = await axios.get(`${api_url}/stocks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};