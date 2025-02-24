// api/doctors.js
import { createAxiosInstance } from './axiosHelper';
const axios = createAxiosInstance();

export const doctorsAPI = {
  getAllDoctors: async (filters = {}) => {
    try {
      const response = await axios.get('/doctors', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get doctors error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  },

  
  getDoctorAvailability: async (doctorId, date) => {
    try {
      const response = await axios.get(`/doctors/${doctorId}/availability`, { params: { date } });
      return response.data;
    } catch (error) {
      console.error('Get availability error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch availability');
    }
  },
  
  getDoctorById: async (id) => {
    try {
      const response = await axios.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get doctor error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor');
    }
  },
  searchDoctors: async (searchParams) => {
    try {
      const response = await axios.get('/doctors', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Search doctors error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to search doctors');
    }
  },
  

  getDoctorReviews: async (doctorId) => {
    try {
      const response = await axios.get(`/doctors/${doctorId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Get reviews error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  postDoctorReview: async (doctorId, reviewData) => {
    try {
      const response = await axios.post(`/doctors/${doctorId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Post review error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to post review');
    }
  }
};