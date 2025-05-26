import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, useTheme, Fade, Divider } from '@mui/material';
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
        const rect = e.currentTarget.getBoundingClientRect();
        const initialX = e.clientX - rect.left;
        const initialY = e.clientY - rect.top;
        
        const noteWithOffset = {
            ...note,
            offsetX: initialX,
            offsetY: initialY
        };
        
        e.dataTransfer.setData('application/json', JSON.stringify(noteWithOffset));
        e.dataTransfer.effectAllowed = 'move';

        const dragPreview = document.createElement('div');
        dragPreview.style.position = 'absolute';
        dragPreview.style.top = '-1000px';
        dragPreview.style.width = '300px';
        dragPreview.style.padding = '16px';
        dragPreview.style.backgroundColor = '#fff9c4';
        dragPreview.style.border = '1px solid #e0e0e0';
        dragPreview.style.borderRadius = '8px';
        dragPreview.style.boxShadow = theme.shadows[8];
        dragPreview.style.opacity = '0.8';
        dragPreview.style.transform = 'rotate(-2deg)';
        dragPreview.style.pointerEvents = 'none';
        dragPreview.innerHTML = note.text;
        document.body.appendChild(dragPreview);

        e.dataTransfer.setDragImage(dragPreview, initialX, initialY);

        setTimeout(() => {
            document.body.removeChild(dragPreview);
        }, 0);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                left: 0,
                top: '64px',
                width: '320px',
                height: 'calc(100vh - 64px)',
                backgroundColor: theme.palette.background.paper,
                borderRight: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[2],
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ 
                p: 2, 
                flex: 1, 
                display: "flex", 
                flexDirection: "column", 
                height: '100%',
                backgroundColor: theme.palette.background.paper,
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                    }}
                >
                    Notebook Notes
                </Typography>
                <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
                {notebookNotes.length === 0 ? (
                    <Fade in timeout={500}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: "center",
                                mt: 2,
                                p: 2,
                                backgroundColor: theme.palette.action.hover,
                                borderRadius: 1,
                            }}
                        >
                            No notebook notes available. Create notes to get started!
                        </Typography>
                    </Fade>
                ) : (
                    <List sx={{ 
                        flex: 1, 
                        overflow: "auto",
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
                        {notebookNotes.map((note, index) => (
                            <Fade in timeout={500} key={note.id} style={{ transitionDelay: `${index * 50}ms` }}>
                                <ListItem 
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
                                            backgroundColor: '#fff9c4',
                                            transform: 'rotate(-1deg)',
                                            transition: 'all 0.3s ease-in-out',
                                            cursor: 'grab',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'rotate(0deg) scale(1.02) translateY(-2px)',
                                                boxShadow: theme.shadows[4],
                                            },
                                            '&:active': {
                                                cursor: 'grabbing',
                                                transform: 'rotate(-2deg) scale(0.95)',
                                                opacity: 0.5,
                                            },
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
                                                borderRadius: 'inherit',
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
                                                fontWeight: 500,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            {note.text}
                                        </Typography>
                                    </Paper>
                                </ListItem>
                            </Fade>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default NotebookSidebar;
