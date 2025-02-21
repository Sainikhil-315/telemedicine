// api/users.js
import { createAxiosInstance } from './axiosHelper';
const axios = createAxiosInstance();

export const usersAPI = {
  getUserProfile: async () => {
    try {
      const response = await axios.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await axios.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  changePassword: async (passwords) => {
    try {
      const response = await axios.put('/users/change-password', passwords);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  uploadProfilePicture: async (formData) => {
    try {
      const response = await axios.post('/users/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Upload picture error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to upload picture');
    }
  }
};