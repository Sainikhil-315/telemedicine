import React, { useState, useEffect, useRef } from "react";
import { getChatHistory, sendMessage } from "../api/chatbotApi";
import DynamicAIResponse from "./DynamicAIResponse"; // Added the missing import

const ChatBot = ({ userId, isAssessing, onSendMessage, setMessages, messages }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    async function fetchChatHistory() {
      if (userId) {
        const data = await getChatHistory(userId);
        if (data && data.messages) {
          setMessages(data.messages);
        }
      }
    }

    // Only fetch if we don't already have messages
    if (messages.length === 0) {
      fetchChatHistory();
    }
  }, [userId, setMessages, messages.length]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isAssessing) return;

    // Temporarily add the user message to UI
    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input and set assessing state
    setInput("");
    onSendMessage(true); // Set assessing to true while waiting for response

    // Send to API and get response
    try {
      const data = await sendMessage(userId, input.trim());
      if (data && data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I encountered an error processing your request." }
      ]);
    } finally {
      onSendMessage(false); // Set assessing back to false
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100%" }}>
      {/* Chat Messages Area */}
      <div className="flex-grow-1 overflow-auto p-3 align-items-center justify-content-center" style={{ maxHeight: "calc(90vh - 180px)" }}>
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              {msg.sender === "user" ? (
                <div
                  className="bg-primary text-white py-2 px-3 rounded"
                  style={{ maxWidth: "75%", overflowWrap: "break-word" }}
                >
                  {msg.text}
                </div>
              ) : (
                <div style={{ maxWidth: "90%", width: "100%" }}>
                  <DynamicAIResponse content={msg.text} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <div className="bg-light rounded-circle p-3 d-inline-block mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-secondary">No messages yet. Start the conversation by typing a message below.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="p-2 border-top mt-auto">
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type a health-related question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isAssessing}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={isAssessing || !input.trim()}
            style={{ minWidth: isAssessing ? "120px" : "80px" }}
          >
            {isAssessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Processing
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>
        
        {/* Typing Indicator */}
        {isAssessing && (
          <div className="text-muted small mt-1 ms-1">
            AI assistant is typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;