import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Divider, IconButton } from '@mui/material';
import { Menu, Chat, Person, Settings } from '@mui/icons-material';

const ChatSidebar = () => {
    return (
        <Box>
            <Drawer
                variant="persistent"
                anchor="left"
                open={true}
                sx={{ width: 300, flexShrink: 0 }}
                PaperProps={{
                    sx: {
                        width: 300,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                        Chat
                    </Typography>
                </Box>
            </Drawer>
        </Box>
    );
};

export default ChatSidebar;