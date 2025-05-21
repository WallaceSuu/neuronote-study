import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, CircularProgress, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import NotebookNavigation from './NotebookNavigation';
import NotebookSidebar from './NotebookSidebar';

const Notebook = () => {
    const [notes, setNotes] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [draggedNote, setDraggedNote] = useState(null);
    const theme = useTheme();

    const fetchTotalPages = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.NOTEBOOK_PAGES, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            setTotalPages(response.data.total_pages || 1);
        } catch (error) {
            console.error('Error fetching total pages:', error);
            setError('Failed to fetch total pages');
        }
    };

    const fetchNotebookNotes = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${API_ENDPOINTS.NOTEBOOK_NOTES}/${currentPage}/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notebook notes:', error);
            setError(error.response?.data?.error || 'Failed to fetch notes');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchTotalPages();
    }, [refreshTrigger]);

    useEffect(() => {
        fetchNotebookNotes();
    }, [currentPage, refreshTrigger]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const noteData = JSON.parse(e.dataTransfer.getData('application/json'));
        const rect = e.currentTarget.getBoundingClientRect();
        
        // Calculate position w/ offset
        const x = e.clientX - rect.left - (draggedNote ? draggedNote.offsetX : 0);
        const y = e.clientY - rect.top - (draggedNote ? draggedNote.offsetY : 0);

        try {
            // If it's a note being moved within the notebook
            if (draggedNote) {
                const response = await axios.patch(`${API_ENDPOINTS.UPDATE_NOTEBOOK_NOTE}/${draggedNote.id}/`, {
                    location_x: x,
                    location_y: y
                }, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });

                setNotes(notes.map(note => 
                    note.id === draggedNote.id ? { ...note, location_x: x, location_y: y } : note
                ));
                setDraggedNote(null);
                return;
            }

            // If it's a new note from the sidebar
            const response = await axios.post(API_ENDPOINTS.CREATE_NOTEBOOK_NOTE, {
                page_number: currentPage,
                note: noteData.note,
                text: noteData.text,
                location_x: x,
                location_y: y,
                location_z: notes.length + 1,
                sidebar: false
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            // Delete the original note from the sidebar
            await axios.delete(`${API_ENDPOINTS.UPDATE_NOTEBOOK_NOTE}/${noteData.id}/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            setNotes([...notes, response.data]);
            setRefreshTrigger(prev => prev + 1); // This will refresh both the notebook and sidebar
        } catch (error) {
            console.error('Error handling note drop:', error);
            setError('Failed to update note position');
        }
    };

    const handleNoteDragStart = (e, note) => {
        // Store the initial position and mouse coordinates
        const rect = e.currentTarget.getBoundingClientRect();
        const initialX = e.clientX - rect.left;
        const initialY = e.clientY - rect.top;
        
        setDraggedNote({
            ...note,
            initialX: e.clientX,
            initialY: e.clientY,
            offsetX: initialX,
            offsetY: initialY
        });
        
        e.dataTransfer.setData('application/json', JSON.stringify(note));
        e.dataTransfer.effectAllowed = 'move';

        // Create drag image
        const dragPreview = document.createElement('div');
        dragPreview.style.position = 'absolute';
        dragPreview.style.top = '-1000px';
        dragPreview.style.width = '300px';
        dragPreview.style.padding = '16px';
        dragPreview.style.backgroundColor = theme.palette.background.paper;
        dragPreview.style.border = `1px solid ${theme.palette.divider}`;
        dragPreview.style.borderRadius = '8px';
        dragPreview.style.boxShadow = theme.shadows[8];
        dragPreview.style.opacity = '0.8';
        dragPreview.style.transform = 'rotate(-2deg)';
        dragPreview.style.pointerEvents = 'none';
        dragPreview.innerHTML = note.text;
        document.body.appendChild(dragPreview);

        // Calculate offset
        e.dataTransfer.setDragImage(dragPreview, initialX, initialY);

        // Remove the preview after drag start
        setTimeout(() => {
            document.body.removeChild(dragPreview);
        }, 0);
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await axios.delete(`${API_ENDPOINTS.UPDATE_NOTEBOOK_NOTE}/${noteId}/`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            setNotes(notes.filter(note => note.id !== noteId));
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting note:', error);
            setError('Failed to delete note');
        }
    };

    return (
        <Box sx={{ 
            position: 'relative', 
            minHeight: '100vh', 
            backgroundColor: theme.palette.background.default,
            overflow: 'hidden'
        }}>
            <NotebookNavigation 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                refreshPages={() => setRefreshTrigger(prev => prev + 1)}
            />
            <NotebookSidebar refreshTrigger={refreshTrigger} />
            
            {/* Main content area */}
            <Box
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                    position: 'relative',
                    marginLeft: '250px',
                    width: 'calc(100% - 250px)',
                    height: 'calc(100vh - 64px)',
                    overflow: 'hidden',
                    padding: '24px',
                    cursor: 'default',
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `
                        linear-gradient(${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider} 1px, transparent 1px),
                        linear-gradient(90deg, ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider} 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: '12px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                    }
                }}
            >
                {isLoading ? (
                    <Fade in timeout={500}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%' 
                        }}>
                            <CircularProgress size={40} />
                        </Box>
                    </Fade>
                ) : error ? (
                    <Fade in timeout={500}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%' 
                        }}>
                            <Typography 
                                color="error"
                                sx={{
                                    p: 3,
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                    borderRadius: 2,
                                    maxWidth: '600px',
                                    textAlign: 'center'
                                }}
                            >
                                {error}
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    notes.map((note) => (
                        <Fade in timeout={500} key={note.id}>
                            <Paper
                                draggable
                                onDragStart={(e) => handleNoteDragStart(e, note)}
                                elevation={3}
                                sx={{
                                    position: 'absolute',
                                    left: note.location_x || 0,
                                    top: note.location_y || 0,
                                    zIndex: note.location_z || 0,
                                    padding: '16px',
                                    maxWidth: '300px',
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '12px',
                                    cursor: 'move',
                                    transition: 'all 0.3s ease-in-out',
                                    transform: draggedNote?.id === note.id ? 'scale(0.95)' : 'scale(1)',
                                    opacity: draggedNote?.id === note.id ? 0.5 : 1,
                                    '&:hover': {
                                        boxShadow: theme.shadows[8],
                                        transform: 'scale(1.02) translateY(-2px)',
                                    },
                                    '&:active': {
                                        cursor: 'grabbing',
                                        transform: 'scale(0.98)',
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    position: 'relative',
                                    '&:hover .delete-button': {
                                        opacity: 1,
                                        transform: 'scale(1)',
                                    }
                                }}>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: theme.palette.text.primary,
                                            lineHeight: 1.5,
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        {note.text}
                                    </Typography>
                                    <Box
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNote(note.id);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            right: -12,
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: theme.palette.error.light,
                                            color: theme.palette.error.contrastText,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            opacity: 0,
                                            transform: 'scale(0.8)',
                                            transition: 'all 0.2s ease-in-out',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            boxShadow: theme.shadows[2],
                                            '&:hover': {
                                                backgroundColor: theme.palette.error.main,
                                                transform: 'scale(1.1)',
                                            }
                                        }}
                                    >
                                        ×
                                    </Box>
                                </Box>
                            </Paper>
                        </Fade>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Notebook;
