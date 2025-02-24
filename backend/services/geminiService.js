// services/geminiService.js
const axios = require("axios");

exports.getGeminiResponse = async (text) => {
  try {
    const response = await axios.post(
      "https://api.gemini.com/v1/chat", // Replace with actual Gemini API endpoint
      { prompt: text },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );

    return response.data.reply;
  } catch (error) {
    console.error("Error fetching response from Gemini API", error);
    return "Sorry, I couldn't process your request.";
  }
};
