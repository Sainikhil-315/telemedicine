// import apiClient from './index';
// import io from 'socket.io-client';

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// // Get chat history with a specific doctor
// export const getChatHistory = async (doctorId) => {
//   const response = await apiClient.get(`/chat/${doctorId}`);
//   return response.data;
// };

// // Send message to doctor
// export const sendMessage = async (doctorId, message) => {
//   const response = await apiClient.post(`/chat/${doctorId}`, { message });
//   return response.data;
// };

// // Initialize symptom assessment
// export const startSymptomAssessment = async () => {
//   const response = await apiClient.post('/chat/symptom-assessment');
//   return response.data;
// };

// // Submit symptom for assessment
// export const submitSymptom = async (assessmentId, symptomData) => {
//   const response = await apiClient.post(`/chat/symptom-assessment/${assessmentId}`, symptomData);
//   return response.data;
// };

// // Get assessment result
// export const getAssessmentResult = async (assessmentId) => {
//   const response = await apiClient.get(`/chat/symptom-assessment/${assessmentId}/result`);
//   return response.data;
// };

// // Initialize socket connection
// export const initializeSocket = (token) => {
//   const socket = io(SOCKET_URL, {
//     auth: {
//       token
//     }
//   });

//   return socket;
// };


import axios from "axios";

const API_URL = "http://localhost:5000/api/chat"; // Change this if your backend URL is different

// Get chat history for a specific user
export const getChatHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/history/${userId}`);
    console.log("response data in chat: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return { messages: [] }; // Return empty messages on failure
  }
};

// Send a message and receive AI response
export const sendMessage = async (userId, text) => {
  try {
    const response = await axios.post(`${API_URL}/send`, {
      userId,
      text,
    });
    console.log("response data in chat: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return { messages: [] }; // Return empty messages on failure
  }
};
