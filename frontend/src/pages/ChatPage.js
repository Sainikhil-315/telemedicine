import React, { useState, useEffect } from 'react';
import ChatBot from '../components/Chatbot';
import { getChatHistory } from '../api/chatbotApi';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isAssessing, setIsAssessing] = useState(false);
  
  // Use a dummy userId for now (or get it from authentication)
  const userId = "65f1a2b3c4d5e6f7a8b9c0d1"; // Example MongoDB ObjectId format
  
  useEffect(() => {
    // Fetch chat history when component mounts
    async function loadChatHistory() {
      const data = await getChatHistory(userId);
      if (data && data.messages) {
        setMessages(data.messages);
      }
    }
    loadChatHistory();
  }, [userId]);

  const handleAssessmentStatus = (status) => {
    setIsAssessing(status);
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <div className="flex-grow overflow-hidden rounded-lg shadow-lg">
          <div className="flex flex-col h-full">
            <div className="bg-white px-4 py-2 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-800">Medical Chat Assistant</h5>
            </div>
            <div className="flex-grow overflow-hidden">
              <ChatBot 
                userId={userId}
                messages={messages}
                setMessages={setMessages}
                isAssessing={isAssessing}
                onSendMessage={handleAssessmentStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;