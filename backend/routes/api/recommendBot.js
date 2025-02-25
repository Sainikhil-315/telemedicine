const express = require("express");
const axios = require("axios");
const router = express.Router();

// Route for Symptom Recommendation Bot
router.post("/", async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: "Please provide symptom description",
      });
    }

    // Forward request to Flask AI service
    const flaskResponse = await axios.post("http://127.0.0.1:5001/api/predict", {
      symptoms,
    });
    console.log(flaskResponse);
    console.log("Request redirected to flask")
    // Send Flask response back to the frontend
    return res.json(flaskResponse.data);
  } catch (error) {
    console.error("Error in recommendation bot route:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
});

module.exports = router;
