import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch sales data with filters, search, sort, and pagination
 */
export const fetchSalesData = async (params) => {
  try {
    const response = await api.get('/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

/**
 * Fetch filter options
 */
export const fetchFilterOptions = async () => {
  try {
    const response = await api.get('/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

export default api;
