import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const ChatBox = ({ selectedNote }) => {
    const theme = useTheme();
    return (
        <Box sx={{ p: 3, flex: 1, height: '100%' }}>
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
    );
};

export default ChatBox;