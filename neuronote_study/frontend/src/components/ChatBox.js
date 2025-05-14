import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Divider, IconButton } from '@mui/material';
import { Menu, Chat, Person, Settings } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const ChatBox = () => {
    const theme = useTheme();
    return (
        <Box>
            <Drawer
                variant="persistent"
                anchor="left"
                open={true}
                sx={{ width: 300, flexShrink: 0 }}
            >
                <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                        Welcome to the chat box, feel free to ask any questions!
                    </Typography>
                </Box>
            </Drawer>
        </Box>
    )
}   

export default ChatBox;