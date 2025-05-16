import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, useTheme } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const NotebookSidebar = ({ refreshTrigger }) => {
    const theme = useTheme();
    const [notebookNotes, setNotebookNotes] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        const fetchSidebarNotebookNotes = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINTS.SIDEBAR_NOTEBOOK_NOTES}/${pageNumber}/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setNotebookNotes(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching notebook notes:', error);
            }
        };
        fetchSidebarNotebookNotes();
    }, [pageNumber, refreshTrigger]);

    const handleDragStart = (e, note) => {
        e.dataTransfer.setData('application/json', JSON.stringify(note));
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                position: 'fixed',
                left: 0,
                top: '64px',
                width: '250px',
                height: 'calc(100vh - 64px)',
                backgroundColor: theme.palette.background.default,
                overflow: 'auto',
                zIndex: 1000,
                borderRight: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: theme.shadows[8],
                }
            }}
        >
            <Typography variant="h6" sx={{ 
                p: 2, 
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                position: 'sticky',
                top: 0,
                zIndex: 1
            }}>
                Notebook Notes
            </Typography>
            <List sx={{ width: '100%', p: 2 }}>
                {notebookNotes.map((note) => (
                    <ListItem 
                        key={note.id} 
                        sx={{ 
                            p: 0, 
                            mb: 2,
                            display: 'block'
                        }}
                    >
                        <Paper
                            draggable
                            onDragStart={(e) => handleDragStart(e, note)}
                            elevation={2}
                            sx={{
                                p: 2,
                                backgroundColor: '#fff9c4', // Light yellow color for sticky note
                                transform: 'rotate(-1deg)', // Slight rotation for sticky note effect
                                transition: 'transform 0.2s ease-in-out',
                                cursor: 'grab',
                                '&:hover': {
                                    transform: 'rotate(0deg) scale(1.02)',
                                    boxShadow: theme.shadows[4],
                                },
                                '&:active': {
                                    cursor: 'grabbing',
                                },
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)',
                                    backgroundSize: '3px 3px',
                                    opacity: 0.5,
                                    pointerEvents: 'none',
                                }
                            }}
                        >
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#2c3e50',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word',
                                    maxHeight: '100px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    fontWeight: 500
                                }}
                            >
                                {note.text}
                            </Typography>
                        </Paper>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default NotebookSidebar;
