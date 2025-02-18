import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { formatDateTime } from '../utils';
import { sendMessage, getChatHistory } from '../api/chat';

const ChatBox = ({ receiverId, receiverName, receiverPhoto, isDoctor = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  
  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const data = await getChatHistory(receiverId);
        setMessages(data.messages || []);
      } catch (err) {
        setError('Failed to load chat history. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (receiverId) {
      fetchChatHistory();
    }
  }, [receiverId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      const response = await sendMessage(receiverId, newMessage);
      
      // Add the sent message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        response.message
      ]);
      
      // Clear the input
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };
  
  return (
    <Card className="chat-box h-100 d-flex flex-column">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex align-items-center">
          {receiverPhoto ? (
            <img
              src={receiverPhoto}
              alt={receiverName}
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
          ) : (
            <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
              {receiverName?.charAt(0)}
            </div>
          )}
          <div>
            <h6 className="mb-0">{receiverName}</h6>
            <small className="text-muted">
              {isDoctor ? 'Doctor' : 'Patient'}
            </small>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body className="p-3 overflow-auto" style={{ flexGrow: 1 }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading conversation...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        ) : messages.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-comment-dots fa-4x text-muted mb-3"></i>
            <h5>No messages yet</h5>
            <p className="text-muted">
              Start the conversation by saying hello!
            </p>
          </div>
        ) : (
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message mb-3 ${
                  message.senderId === receiverId ? 'received' : 'sent'
                }`}
              >
                <div
                  className={`message-bubble p-3 ${
                    message.senderId === receiverId
                      ? 'bg-light rounded-end rounded-bottom'
                      : 'bg-primary text-white rounded-start rounded-bottom'
                  }`}
                  style={{ maxWidth: '75%', display: 'inline-block' }}
                >
                  <div className="message-text">{message.content}</div>
                  <div 
                    className={`message-time small ${
                      message.senderId === receiverId ? 'text-muted' : 'text-light'
                    }`}
                  >
                    {formatDateTime(message.timestamp, 'h:mm A')}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card.Body>
      
      <Card.Footer className="bg-white p-3 border-top">
        <Form onSubmit={handleSendMessage}>
          <div className="input-group">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sendingMessage}
              className="border-end-0"
            />
            <Button 
              variant="primary" 
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
              className="d-flex align-items-center"
            >
              {sendingMessage ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </Button>
          </div>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default ChatBox;