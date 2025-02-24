const express = require("express");
const axios = require("axios");

const router = express.Router();

// @route   POST api/symptom/predict
// @desc    Predict symptom from user input
// @access  Public
router.post("/predict", async (req, res) => {
    try {
        const { text } = req.body; // Extract user input from request

        if (!text) {
            return res.status(400).json({ error: "No text provided" });
        }

        // Send request to Flask AI service
        const response = await axios.post("http://localhost:5001/predict", { text });

        res.json(response.data); // Send back the predicted symptom
    } catch (error) {
        console.error("Error predicting symptom:", error);
        res.status(500).json({ error: "Failed to process symptom prediction" });
    }
});

module.exports = router;
