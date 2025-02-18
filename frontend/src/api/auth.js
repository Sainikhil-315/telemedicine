// api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    // Log the response for debugging
    console.log('API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('API Error Details:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    // Log the response for debugging
    console.log('API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('API Error Details:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const checkAuthStatus = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Auth Status Check Error:', error.response?.data);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    console.error('Logout Error:', error.response?.data);
    throw error;
  }
};