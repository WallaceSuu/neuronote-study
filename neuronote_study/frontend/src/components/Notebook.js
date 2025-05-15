import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
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
    const theme = useTheme();

    const fetchNotebookNotes = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.NOTEBOOK_NOTES(currentPage));
            setNotes(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching notebook notes:', error);
            setError('Failed to fetch notes');
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchNotebookNotes();
    }, [currentPage]);

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <NotebookNavigation />
            <NotebookSidebar />
            
            {/* Main content area */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: 'calc(100vh - 64px)', // Adjust based on your header height
                    overflow: 'hidden',
                    padding: '20px',
                }}
            >
                {notes.map((note) => (
                    <Paper
                        key={note.id}
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
                        }}
                    >
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                            {note.text}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default Notebook;
