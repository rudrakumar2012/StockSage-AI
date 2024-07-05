// client/src/api/stockService.js
export async function fetchNifty50Data() {
    try {
      const response = await fetch('/api/nifty50');
      if (!response.ok) {
        throw new Error('Failed to fetch Nifty 50 data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Nifty 50 data:', error);
      throw error;
    }
  }