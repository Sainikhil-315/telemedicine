
// ChatPage.js
import React, { useState, useEffect } from 'react';
import ChatBox from '../components/Chatbox';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isAssessing, setIsAssessing] = useState(false);

  const handleSendMessage = async (message) => {
    // Implement chat message handling
    // This would integrate with your NLP/ML backend
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Medical Assistant Chat</h5>
            </div>
            <div className="card-body" style={{ height: '70vh' }}>
              <ChatBox 
                messages={messages}
                onSendMessage={handleSendMessage}
                isAssessing={isAssessing}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Symptom Summary</h5>
            </div>
            <div className="card-body">
              {/* Implement symptom summary component */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;