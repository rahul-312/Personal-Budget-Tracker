import axios from 'axios';

// Define the base URL for the API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/'; // Default to your production URL if not provided in .env

// Define API endpoints dynamically using BASE_URL
export const API = {
  REGISTER: `${BASE_URL}users/register/`,
  LOGIN: `${BASE_URL}users/login/`,
  LOGOUT: `${BASE_URL}users/logout/`,
  USER_DATA: `${BASE_URL}users/data/`,
  // Add other endpoints here as needed
};

// Define API config for axios requests
export const apiConfig = {
  timeout: 5000, // Set your desired timeout here
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
};

// Create an axios instance to handle API requests
const api = axios.create({
  baseURL: BASE_URL,  // Base URL for all requests
  headers: apiConfig.headers,
});

// Function to get Authorization headers with the stored access token
export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    throw new Error("No access token found in localStorage. Please log in again.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await api.post(API.LOGIN, credentials);  // Make a POST request to the LOGIN endpoint
    
    console.log('Login response:', response.data);  // Log the full response to debug
    
    if (!response.data || !response.data.tokens) {
      throw new Error('Tokens not found in the response');
    }
    
    localStorage.setItem('access_token', response.data.tokens.access);  // Save access token in localStorage
    localStorage.setItem('refresh_token', response.data.tokens.refresh);  // Save refresh token in localStorage
    return response;  // Return the response for further handling
  } catch (error) {
    console.error('Login failed:', error.response || error.message);
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await api.post(API.REGISTER, userData);  // Make a POST request to the REGISTER endpoint
    console.log('Registration response:', response.data);
    return response;  // Return the response for further handling
  } catch (error) {
    console.error('Registration failed:', error.response || error.message);
    throw error;  // Rethrow the error to be handled by the calling function
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await api.post(API.LOGOUT);  // Make a POST request to the LOGOUT endpoint
    localStorage.removeItem('access_token');  // Clear the access token from localStorage
    localStorage.removeItem('refresh_token');  // Clear the refresh token from localStorage
    console.log('Logout successful');
    return response;  // Return the response for further handling
  } catch (error) {
    console.error('Logout failed:', error.response || error.message);
    throw error;  // Rethrow the error to be handled by the calling function
  }
};
