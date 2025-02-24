// controllers/chatbotController.js
const Chat = require("../models/Chat");
const geminiService = require("../services/geminiService");

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chat = await Chat.findOne({ userId });

    if (!chat) return res.json({ messages: [] });

    res.json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { userId, text } = req.body;

    // Get AI response from Gemini
    const botResponse = await geminiService.getGeminiResponse(text);

    // Find or create a chat document for the user
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // Add user and bot messages to chat history
    chat.messages.push({ sender: "user", text });
    chat.messages.push({ sender: "bot", text: botResponse });

    await chat.save();

    res.json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: "Error processing message" });
  }
};
