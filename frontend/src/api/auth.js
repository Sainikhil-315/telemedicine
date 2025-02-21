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

  checkAuthStatus: async () => {
    try {
      const response = await axios.get('/auth/status');
      return response.data;
    } catch (error) {
      console.error('Auth status error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to check auth status');
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