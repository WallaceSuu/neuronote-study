import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, TextField, Button, Paper, Avatar, CircularProgress, Fade } from '@mui/material';
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
                note_id: selectedNote.note_id,
                note_text: selectedNote.note_text
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
                p: 3,
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
            }}>
                {selectedNote ? (
                    <>
                        <Avatar 
                            sx={{ 
                                bgcolor: theme.palette.primary.light,
                                width: 40,
                                height: 40,
                                boxShadow: theme.shadows[1],
                            }}
                        >
                            <SmartToyIcon />
                        </Avatar>
                        <Typography 
                            sx={{ 
                                color: theme.palette.text.secondary,
                                fontSize: '1.1rem',
                                fontWeight: 400,
                                letterSpacing: '0.3px',
                            }}
                        >
                            Let's chat about <span style={{ color: theme.palette.primary.main, fontWeight: 500 }}>{selectedNote.note_title}</span>
                        </Typography>
                    </>
                ) : (
                    <Typography 
                        sx={{ 
                            textAlign: "center", 
                            color: theme.palette.text.secondary,
                            fontSize: '1.1rem',
                            fontStyle: 'italic',
                        }}
                    >
                        Choose a note to start a conversation...
                    </Typography>
                )}
            </Box>

            {/* Messages Container */}
            <Box sx={{ 
                flex: 1, 
                overflowY: 'auto',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.divider,
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                    },
                },
            }}>
                {previousMessages.map((msg, index) => (
                    <Fade in timeout={500} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                maxWidth: '85%',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                animation: 'slideIn 0.3s ease-out',
                                '@keyframes slideIn': {
                                    '0%': {
                                        opacity: 0,
                                        transform: msg.role === 'user' ? 'translateX(20px)' : 'translateX(-20px)',
                                    },
                                    '100%': {
                                        opacity: 1,
                                        transform: 'translateX(0)',
                                    },
                                },
                            }}
                        >
                            {msg.role === 'assistant' && (
                                <Avatar 
                                    sx={{ 
                                        bgcolor: theme.palette.primary.light,
                                        boxShadow: theme.shadows[1],
                                        width: 36,
                                        height: 36,
                                    }}
                                >
                                    <SmartToyIcon fontSize="small" />
                                </Avatar>
                            )}
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    bgcolor: msg.role === 'user' 
                                        ? theme.palette.primary.main 
                                        : theme.palette.background.paper,
                                    color: msg.role === 'user' 
                                        ? theme.palette.primary.contrastText 
                                        : theme.palette.text.primary,
                                    borderRadius: 3,
                                    maxWidth: '100%',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        boxShadow: theme.shadows[2],
                                    },
                                }}
                            >
                                <Box sx={{ 
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.5,
                                }}>
                                    {formatMessage(msg.message)}
                                </Box>
                            </Paper>
                            {msg.role === 'user' && (
                                <Avatar 
                                    sx={{ 
                                        bgcolor: theme.palette.secondary.light,
                                        boxShadow: theme.shadows[1],
                                        width: 36,
                                        height: 36,
                                    }}
                                >
                                    <PersonIcon fontSize="small" />
                                </Avatar>
                            )}
                        </Box>
                    </Fade>
                ))}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Container */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 2,
                    bgcolor: theme.palette.background.paper,
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: 0,
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            transition: 'all 0.2s ease-in-out',
                            borderRadius: 2,
                            '&:hover': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        },
                    }}
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
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-in-out',
                        borderRadius: 2,
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
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