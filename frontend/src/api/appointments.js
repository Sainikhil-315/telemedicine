// api/appointments.js
import { createAxiosInstance } from './axiosHelper';
const axios = createAxiosInstance();

export const appointmentsAPI = {
  getUserAppointments: async (status) => {
    try {
      const params = status ? { status } : {};
      const response = await axios.get('/appointments', { params });
      return response.data;
    } catch (error) {
      console.error('Get appointments error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Create appointment error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await axios.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get appointment error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment');
    }
  },

  cancelAppointment: async (id, reason) => {
    try {
      const response = await axios.delete(`/appointments/${id}`, { reason });
      return response.data;
    } catch (error) {
      console.error('Cancel appointment error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  },

  rescheduleAppointment: async (id, newDateTime) => {
    try {
      const response = await axios.put(`/appointments/${id}`, { newDateTime });
      return response.data;
    } catch (error) {
      console.error('Reschedule appointment error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to reschedule appointment');
    }
  },

  // completeAppointment: async (id, summary) => {
  //   try {
  //     const response = await axios.put(`/appointments/${id}/complete`, { summary });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Complete appointment error:', error.response?.data);
  //     throw new Error(error.response?.data?.message || 'Failed to complete appointment');
  //   }
  // }
};