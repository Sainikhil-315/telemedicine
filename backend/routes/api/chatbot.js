// routes/api/chatbot.js
const express = require("express");
const router = express.Router();
const chatbotController = require("../../controllers/chatbotController");

router.get("/:userId", chatbotController.getChatHistory);
router.post("/send", chatbotController.sendMessage);

module.exports = router;
