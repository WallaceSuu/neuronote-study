import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, TextField, Button, Paper, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';

const ChatBox = ({ selectedNote }) => {
    const theme = useTheme();
    const [message, setMessage] = useState('');
    const [previousMessages, setPreviousMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const formatMessage = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Remove the ** and make the text bold
                const boldText = part.slice(2, -2);
                return (
                    <Typography
                        key={index}
                        component="span"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {boldText}
                    </Typography>
                );
            }
            return <Typography key={index} component="span">{part}</Typography>;
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [previousMessages]);

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return;
        
        try {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.post(API_ENDPOINTS.SEND_MESSAGE, {
                message: message,
                note_id: selectedNote.note_id
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            
            // Add the user message immediately
            const userMessage = {
                message: message,
                role: 'user',
                created_at: new Date().toISOString()
            };
            setPreviousMessages(prev => [...prev, userMessage]);
            
            // Add the assistant's response
            const assistantMessage = {
                message: response.data.message,
                role: 'assistant',
                created_at: new Date().toISOString()
            };
            setPreviousMessages(prev => [...prev, assistantMessage]);
            
            // Clear the input field
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_ENDPOINTS.GET_MESSAGES}${selectedNote.note_id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setPreviousMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (selectedNote) {
            fetchMessages();
        }
    }, [selectedNote]);

    return (
        <Box sx={{ 
            p: 0, 
            flex: 1, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative',
            bgcolor: theme.palette.background.default
        }}>
            {/* Header */}
            <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper
            }}>
                {selectedNote ? (
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        Chatting about: {selectedNote.note_title}
                    </Typography>
                ) : (
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                        Please select a note from the sidebar to start chatting.
                    </Typography>
                )}
            </Box>

            {/* Messages Container */}
            <Box sx={{ 
                flex: 1, 
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {previousMessages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-start',
                            gap: 1,
                            maxWidth: '80%',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        {msg.role === 'assistant' && (
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                <SmartToyIcon />
                            </Avatar>
                        )}
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                bgcolor: msg.role === 'user' ? theme.palette.primary.main : theme.palette.background.paper,
                                color: msg.role === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                borderRadius: 2,
                                maxWidth: '100%'
                            }}
                        >
                            <Box sx={{ whiteSpace: 'pre-wrap' }}>
                                {formatMessage(msg.message)}
                            </Box>
                        </Paper>
                        {msg.role === 'user' && (
                            <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                                <PersonIcon />
                            </Avatar>
                        )}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Container */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 2,
                    bgcolor: theme.palette.background.paper
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Type your message..."
                    variant="outlined"
                    size="small"
                    disabled={!selectedNote || isLoading}
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={handleKeyPress}
                    multiline
                    maxRows={4}
                />
                <Button 
                    variant="contained" 
                    disabled={!selectedNote || !message.trim() || isLoading} 
                    onClick={handleSendMessage}
                    sx={{ 
                        minWidth: 100,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        <>
                            Send
                            <SendIcon sx={{ ml: 1 }} />
                        </>
                    )}
                </Button>
            </Paper>
        </Box>
    );
};

export default ChatBox;