import apiClient from './index';

// Get all appointments for current user
export const getUserAppointments = async (status) => {
  const params = status ? { status } : {};
  const response = await apiClient.get('/appointments', { params });
  return response.data;
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  const response = await apiClient.post('/appointments', appointmentData);
  return response.data;
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
  const response = await apiClient.get(`/appointments/${id}`);
  return response.data;
};

// Cancel appointment
export const cancelAppointment = async (id, reason) => {
  const response = await apiClient.put(`/appointments/${id}/cancel`, { reason });
  return response.data;
};

// Reschedule appointment
export const rescheduleAppointment = async (id, newDateTime) => {
  const response = await apiClient.put(`/appointments/${id}/reschedule`, { newDateTime });
  return response.data;
};

// Complete appointment
export const completeAppointment = async (id, summary) => {
  const response = await apiClient.put(`/appointments/${id}/complete`, { summary });
  return response.data;
};