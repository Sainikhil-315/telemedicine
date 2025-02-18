import apiClient from './index';

// Get all doctors
export const getAllDoctors = async (filters = {}) => {
  const response = await apiClient.get('/doctors', { params: filters });
  return response.data;
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  const response = await apiClient.get(`/doctors/${id}`);
  return response.data;
};

// Get doctor availability
export const getDoctorAvailability = async (doctorId, date) => {
  const response = await apiClient.get(`/doctors/${doctorId}/availability`, {
    params: { date }
  });
  return response.data;
};

// Search doctors by speciality, name, etc.
export const searchDoctors = async (searchParams) => {
  const response = await apiClient.get('/doctors/search', {
    params: searchParams
  });
  return response.data;
};

// Get doctor reviews
export const getDoctorReviews = async (doctorId) => {
  const response = await apiClient.get(`/doctors/${doctorId}/reviews`);
  return response.data;
};

// Post a review for a doctor
export const postDoctorReview = async (doctorId, reviewData) => {
  const response = await apiClient.post(`/doctors/${doctorId}/reviews`, reviewData);
  return response.data;
};