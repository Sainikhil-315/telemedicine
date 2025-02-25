// services/geminiService.js
const axios = require("axios");
require('dotenv').config(); // Ensure environment variables are loaded

// Function to check if a query is medical-related using keywords
function isMedicalQueryBasic(text) {
  const medicalKeywords = [
    'health', 'doctor', 'medicine', 'medical', 'symptom', 'disease', 'treatment',
    'pain', 'fever', 'cough', 'headache', 'diagnosis', 'hospital', 'clinic',
    'prescription', 'pharmacy', 'drug', 'medication', 'therapy', 'condition',
    'illness', 'cancer', 'diabetes', 'heart', 'blood', 'pressure', 'surgery',
    'infection', 'virus', 'bacterial', 'allergy', 'chronic', 'acute', 'emergency',
    'diet', 'nutrition', 'exercise', 'recovery', 'mental health', 'depression',
    'anxiety', 'vaccination', 'immunization', 'specialist', 'nurse', 'physician',
    'sick', 'cold', 'flu', 'covid', 'injury', 'wound', 'joint', 'muscle', 'bone',
    'skin', 'rash', 'itch', 'swelling', 'dizzy', 'nausea', 'vomit', 'stomach',
    'breathing', 'breath', 'lung', 'throat', 'ear', 'eye', 'nose', 'sleep',
    'tired', 'fatigue', 'stress', 'weight', 'pregnant', 'pregnancy', 'baby',
    'child', 'elderly', 'senior', 'vitamin', 'supplement', 'test', 'scan',
    'xray', 'mri', 'ct', 'ultrasound', 'checkup', 'insurance', 'care'
  ];
  
  const textLower = text.toLowerCase();
  return medicalKeywords.some(keyword => textLower.includes(keyword));
}

// Alternative function using Gemini API to classify if a query is medical-related
async function isMedicalQueryAdvanced(text) {
  try {
    const API_KEY = 'AIzaSyB4KVSHFZANOCgJbuCsDtw7bJxooTApdRc';
    if (!API_KEY) {
      console.error("Gemini API key is missing");
      return true; // Default to accepting the query if we can't check
    }
    
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [
              { text: `Classify if the following query is related to medical topics, health concerns, symptoms, treatments, or healthcare. Only respond with "YES" if it's medical-related, or "NO" if it's not: "${text}"` }
            ]
          }
        ]
      },
      { 
        headers: { "Content-Type": "application/json" },
        params: { key: API_KEY }
      }
    );
    
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0]) {
      const answer = response.data.candidates[0].content.parts[0].text.trim().toUpperCase();
      return answer.includes("YES");
    }
    
    return true; // Default to accepting if we can't parse the response
  } catch (error) {
    console.error("Error classifying query:", error.message);
    return true; // Default to accepting the query if classification fails
  }
}

exports.getGeminiResponse = async (text) => {
  try {
    // Choose which method to use for checking medical relevance
    // For faster responses but less accurate: isMedicalQueryBasic(text)
    // For more accurate but slower (requires API call): await isMedicalQueryAdvanced(text)
    if (!isMedicalQueryBasic(text)) {
      return "I'm specialized in medical assistance and can only respond to health-related inquiries. Some examples of questions I can help with include:\n\n- 'What are the symptoms of the flu?'\n- 'How can I manage my diabetes?'\n- 'What should I know about this medication?'\n- 'When should I see a doctor about this pain?'\n\nPlease feel free to ask any medical or health-related question.";
    }

    const API_KEY = 'AIzaSyB4KVSHFZANOCgJbuCsDtw7bJxooTApdRc';
    if (!API_KEY) {
      console.error("Gemini API key is missing");
      return "Error: API key is missing. Please check server configuration.";
    }

    console.log("Sending request to Gemini API with text:", text);
    
    // Enhance the prompt to focus on medical responses
    const medicalPrompt = `You are a medical assistant. Please provide information about the following health-related query: ${text}\n\nAlways include a disclaimer that you are not a doctor and medical advice should be sought from healthcare professionals.`;
    
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [
              { text: medicalPrompt }
            ]
          }
        ]
      },
      { 
        headers: { 
          "Content-Type": "application/json" 
        },
        params: {
          key: 'AIzaSyB4KVSHFZANOCgJbuCsDtw7bJxooTApdRc'
        }
      }
    );

    console.log("Received response from Gemini API");

    // Parse response based on Gemini API structure
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    console.error("Unexpected response structure from Gemini API:", JSON.stringify(response.data, null, 2));
    return "Sorry, I received an unexpected response format.";
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error.message);
    if (error.response) {
      console.error("API response error data:", JSON.stringify(error.response.data, null, 2));
      console.error("API response status:", error.response.status);
      
      // More specific error messages based on status codes
      if (error.response.status === 400) {
        return "Sorry, there was an issue with the request format.";
      } else if (error.response.status === 401 || error.response.status === 403) {
        return "Sorry, there was an authentication issue with the AI service.";
      } else if (error.response.status === 429) {
        return "Sorry, we've hit the rate limit for the AI service. Please try again later.";
      }
    }
    return "Sorry, I couldn't process your request.";
  }
};