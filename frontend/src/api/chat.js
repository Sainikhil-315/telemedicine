import apiClient from './index';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Get chat history with a specific doctor
export const getChatHistory = async (doctorId) => {
  const response = await apiClient.get(`/chat/${doctorId}`);
  return response.data;
};

// Send message to doctor
export const sendMessage = async (doctorId, message) => {
  const response = await apiClient.post(`/chat/${doctorId}`, { message });
  return response.data;
};

// Initialize symptom assessment
export const startSymptomAssessment = async () => {
  const response = await apiClient.post('/chat/symptom-assessment');
  return response.data;
};

// Submit symptom for assessment
export const submitSymptom = async (assessmentId, symptomData) => {
  const response = await apiClient.post(`/chat/symptom-assessment/${assessmentId}`, symptomData);
  return response.data;
};

// Get assessment result
export const getAssessmentResult = async (assessmentId) => {
  const response = await apiClient.get(`/chat/symptom-assessment/${assessmentId}/result`);
  return response.data;
};

// Initialize socket connection
export const initializeSocket = (token) => {
  const socket = io(SOCKET_URL, {
    auth: {
      token
    }
  });

  return socket;
};