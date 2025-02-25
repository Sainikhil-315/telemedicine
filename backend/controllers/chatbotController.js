// controllers/chatbotController.js
const Chat = require("../models/Chat");
const geminiService = require("../services/geminiService");
const mongoose = require("mongoose");

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Validate userId format if it's supposed to be a MongoDB ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const chat = await Chat.find({ userId }).sort({ createdAt: -1 }).limit(20); // Fetch latest 20 messages
    res.json(chat);

    if (!chat) return res.json({ messages: [] });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { userId, text } = req.body;
    
    // Validate userId format
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: "Message text is required" });
    }

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
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Error processing message" });
  }
};