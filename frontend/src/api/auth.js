// api/auth.js
import { createAxiosInstance } from './axiosHelper';
const axios = createAxiosInstance();

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

checkAuthStatus: async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove cache control headers from frontend request
        },
        credentials: 'include' // Important for CORS with credentials
      });

      if (!response.ok) {
        throw new Error('Auth check failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Auth check error:', error);
      throw error;
    }
  },
  

  logout: async () => {
    try {
      const response = await axios.post('/auth/logout');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }
};