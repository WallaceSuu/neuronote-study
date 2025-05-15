import React, { useState, useEffect }    from 'react';
import { Box, Typography, useTheme, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const ChatBox = ({ selectedNote }) => {
    const theme = useTheme();
    const [message, setMessage] = useState('');
    const [previousMessages, setPreviousMessages] = useState([]);

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(API_ENDPOINTS.SEND_MESSAGE, {
                message: message,
                note_id: selectedNote.note_id
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error sending message:', error);
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
        <Box sx={{ p: 0, flex: 1, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                {selectedNote ? (
                    <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                        Chatting about: {selectedNote.note_title}
                    </Typography>
                ) : (
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                        Please select a note from the sidebar to start chatting.
                    </Typography>
                )}
            </Box>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 2,
                    background: theme.palette.background.paper,
                }}
            >
                {previousMessages.map((message, index) => (
                    <Typography key={index} variant="body1" sx={{ color: message.role === 'user' ? theme.palette.text.primary : theme.palette.text.secondary }}>
                        {message.message}
                    </Typography>
                ))}
                <TextField
                    fullWidth
                    placeholder="Type your message..."
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2 }}
                    disabled={!selectedNote}
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <Button variant="contained" disabled={!selectedNote} onClick={handleSendMessage}>
                    Send
                </Button>
            </Paper>
        </Box>
    );
};

export default ChatBox;