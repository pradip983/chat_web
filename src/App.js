import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Container, Paper, Typography } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const randomUsername = `User${Math.floor(Math.random() * 1000)}`;
    setUsername(randomUsername);

    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        text: message,
        username: username,
        time: new Date().toLocaleTimeString()
      };
      socket.emit('chat message', messageData);
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Real-time Chat
        </Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            height: '60vh', 
            overflow: 'auto', 
            p: 2, 
            mb: 2 
          }}
        >
          {messages.map((msg, index) => (
            <Box 
              key={index} 
              sx={{
                mb: 1,
                p: 1,
                backgroundColor: msg.username === username ? '#e3f2fd' : '#f5f5f5',
                borderRadius: 1
              }}
            >
              <Typography variant="subtitle2" color="textSecondary">
                {msg.username} - {msg.time}
              </Typography>
              <Typography>{msg.text}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              variant="outlined"
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!message.trim()}
            >
              Send
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default App;