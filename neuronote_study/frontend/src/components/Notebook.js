import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import NotebookNavigation from './NotebookNavigation';
import NotebookSidebar from './NotebookSidebar';

const Notebook = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [draggedNote, setDraggedNote] = useState(null);
    const theme = useTheme();

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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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
        setDraggedNote(note);
        e.dataTransfer.setData('application/json', JSON.stringify(note));
        e.dataTransfer.effectAllowed = 'move';
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
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <NotebookNavigation 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            <NotebookSidebar refreshTrigger={refreshTrigger} />
            
            {/* Main content area */}
            <Box
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                    position: 'relative',
                    marginLeft: '250px', // Add margin to account for left sidebar
                    width: 'calc(100% - 250px)',
                    height: 'calc(100vh - 64px)',
                    overflow: 'hidden',
                    padding: '20px',
                    cursor: 'default',
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `
                        linear-gradient(${theme.palette.divider} 1px, transparent 1px),
                        linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: '8px'
                }}
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    notes.map((note) => (
                        <Paper
                            key={note.id}
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
                                borderRadius: '8px',
                                cursor: 'move',
                                '&:hover': {
                                    boxShadow: theme.shadows[8],
                                    transform: 'scale(1.02)',
                                    transition: 'all 0.2s ease-in-out',
                                },
                                '&:active': {
                                    cursor: 'grabbing',
                                }
                            }}
                        >
                            <Box sx={{ 
                                position: 'relative',
                                '&:hover .delete-button': {
                                    opacity: 1,
                                }
                            }}>
                                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
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
                                        top: -25,
                                        right: -25,
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        backgroundColor: theme.palette.grey[300],
                                        color: theme.palette.grey[700],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        opacity: 0,
                                        transition: 'all 0.2s ease-in-out',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: theme.palette.grey[400],
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                >
                                    ×
                                </Box>
                            </Box>
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Notebook;
