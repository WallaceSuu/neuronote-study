import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatBox from './ChatBox';
import axios from 'axios';
import { API_ENDPOINTS, axiosConfig } from '../config';
import { useTheme } from '@mui/material/styles';

const ChatPage = () => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_ENDPOINTS.NOTES}`, axiosConfig);
                setNotes(response.data.notes);
                setError(null);
            } catch (err) {
                console.error("Error fetching notes:", err);
                setError("Failed to load notes. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    return (
        <Box sx={{ 
            display: 'flex', 
            height: 'calc(100vh - 64px)', 
            mt: '64px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
        }}>
            <ChatSidebar
                notes={notes}
                selectedNote={selectedNote}
                onNoteSelect={setSelectedNote}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    ml: isSidebarOpen ? '320px' : 0,
                    transition: 'all 0.3s ease-in-out',
                    p: isSidebarOpen ? 8 : 9,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {loading ? (
                    <Fade in timeout={500}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '100%',
                        }}>
                            <CircularProgress size={40} />
                        </Box>
                    </Fade>
                ) : error ? (
                    <Fade in timeout={500}>
                        <Typography 
                            color="error" 
                            sx={{ 
                                textAlign: 'center', 
                                mt: 4,
                                p: 3,
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                borderRadius: 2,
                                maxWidth: '600px',
                                mx: 'auto'
                            }}
                        >
                            {error}
                        </Typography>
                    </Fade>
                ) : notes.length === 0 ? (
                    <Fade in timeout={500}>
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 2
                        }}>
                            <Typography 
                                sx={{ 
                                    textAlign: 'center', 
                                    color: theme.palette.text.secondary,
                                    fontSize: '1.2rem'
                                }}
                            >
                                No notes found. Upload a PDF to create your first note!
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    <Fade in timeout={500}>
                        <Box sx={{ height: '100%' }}>
                            <ChatBox selectedNote={selectedNote} />
                        </Box>
                    </Fade>
                )}
            </Box>
        </Box>
    );
};

export default ChatPage;