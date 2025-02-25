import React, { useState } from "react";

const RecommendationBot = () => {
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        // Add user message to chat
        setMessages([...messages, { text: userInput, sender: "user" }]);

        try {
            const token = localStorage.getItem("token");
            if(!token) {
                console.log("No token found")
            }
            const response = await fetch("http://localhost:5000/api/recommend-bot", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                 },
                body: JSON.stringify({ symptoms: userInput }),
            });

            const data = await response.json();

            if (data.success) {
                // Add bot response to chat
                setMessages((prev) => [
                    ...prev,
                    {
                        text: `Predicted: ${data.predicted_disease}\nConfidence: ${(
                            data.confidence * 100
                        ).toFixed(2)}%\nAdvice: ${data.recommended_advice}`, sender: "bot"
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { text: "Bot: Unable to process symptoms. Try again.", sender: "bot" },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { text: "Bot: Error connecting to the server.", sender: "bot" },
            ]);
        }

        setUserInput(""); // Clear input
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Symptom Prediction Bot</h2>
            <div className="chat-box border rounded p-3 mb-3" style={{ height: "400px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`alert d-flex mb-3 ${msg.sender === "user" ? "justify-content-end alert-primary" : "justify-content-start alert-secondary"}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter symptoms..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button className="btn btn-primary" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default RecommendationBot;
