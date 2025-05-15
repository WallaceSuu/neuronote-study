import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const NotebookSidebar = () => {
    const theme = useTheme();

    const [notebookNotes, setNotebookNotes] = useState([]);

    useEffect(() => {
        const fetchSidebarNotebookNotes = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.SIDEBAR_NOTEBOOK_NOTES);
                setNotebookNotes(response.data);
            } catch (error) {
                console.error('Error fetching notebook notes:', error);
            }
        };
        fetchSidebarNotebookNotes();
    }, []);

    return (
        <Paper elevation={3} sx={{ p: 2, width: '250px', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Notebook
            </Typography>
        </Paper>
    )
}
