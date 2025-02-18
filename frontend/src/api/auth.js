import apiClient from './index';

// Login user
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data.user;
};

// Register user
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data.user;
};

// Logout user
export const logout = async () => {
  localStorage.removeItem('token');
  await apiClient.post('/auth/logout');
};

// Check auth status
export const checkAuthStatus = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};