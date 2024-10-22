const RAWG_API_KEY = 'ea375f9d5f7c417a9c65c3339b873a11'; 
const BASE_URL = 'https://api.rawg.io/api';

export const fetchGames = async (endpoint, params = {}) => {
  try {

    const queryParams = new URLSearchParams({
      key: RAWG_API_KEY,
      ...params
    });
    
    const url = `${BASE_URL}${endpoint}?${queryParams}`;
    console.log('Fetching URL:', url); 

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching games:', error);
    return null;
  }
};