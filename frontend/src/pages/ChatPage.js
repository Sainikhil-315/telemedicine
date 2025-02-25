import React, { useState, useEffect } from 'react';
import ChatBot from '../components/Chatbot';
import { getChatHistory } from '../api/chatbotApi';
import { authAPI } from '../api/auth';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isAssessing, setIsAssessing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check authentication status and get user ID when component mounts
    async function authenticateUser() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        
        const authData = await authAPI.checkAuthStatus(token);
        if (authData && authData.user && authData.user._id) {
          setUserId(authData.user._id);
          
          // After getting userId, fetch chat history
          const data = await getChatHistory(authData.user._id);
          if (data && data.messages) {
            setMessages(data.messages);
          }
        } else {
          setError('User data not available');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate user');
      } finally {
        setLoading(false);
      }
    }
    
    authenticateUser();
  }, []);

  const handleAssessmentStatus = (status) => {
    setIsAssessing(status);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 px-4 flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4 px-4 flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <div className="flex-grow overflow-hidden rounded-lg shadow-lg">
          <div className="flex flex-col h-full">
            <div className="bg-white px-4 py-2 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-800">Medical Chat Assistant</h5>
            </div>
            <div className="flex-grow overflow-hidden" style={{height: "80vh"}}>
              {userId ? (
                <ChatBot 
                  userId={userId}
                  messages={messages}
                  setMessages={setMessages}
                  isAssessing={isAssessing}
                  onSendMessage={handleAssessmentStatus}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Please log in to access the chat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;