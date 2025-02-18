import apiClient from './index';

// Get user profile
export const getUserProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put('/users/profile', profileData);
  return response.data;
};

// Change password
export const changePassword = async (passwords) => {
  const response = await apiClient.put('/users/change-password', passwords);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (formData) => {
  const response = await apiClient.post('/users/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};