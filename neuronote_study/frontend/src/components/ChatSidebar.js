import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Divider, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const ChatSidebar = ({ notes, selectedNote, onNoteSelect, isOpen, onToggle }) => {
    const theme = useTheme();
    const formatBoldText = (text) => {
        if (!text) return "";
        const cleanText = text.trim().replace(/^"|"$/g, '');
        const parts = cleanText.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <span key={index} style={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return part;
        });
    };
    return (
        <>
            <IconButton
                onClick={onToggle}
                sx={{
                    position: 'fixed',
                    left: isOpen ? 320 : 20,
                    top: '84px',
                    zIndex: 1200,
                    backgroundColor: theme.palette.action.hover,
                    '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                    },
                    transition: 'left 0.2s ease-in-out',
                }}
            >
                <MenuIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>
            <Drawer
                variant="persistent"
                anchor="left"
                open={isOpen}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 320,
                        backgroundColor: theme.palette.background.sidebar,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: 'none',
                        top: '64px',
                        height: 'calc(100% - 64px)',
                        transition: 'width 0.2s ease-in-out',
                    },
                }}
            >
                <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
                        Your Notes
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
                    {notes.length === 0 ? (
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: "center",
                                mt: 2,
                            }}
                        >
                            No notes available, please upload a PDF to create a note!
                        </Typography>
                    ) : (
                        <List sx={{ flex: 1, overflow: "auto" }}>
                            {notes.map((note) => (
                                <ListItem key={note.note_id} disablePadding>
                                    <ListItemButton
                                        onClick={() => onNoteSelect(note)}
                                        selected={selectedNote?.note_id === note.note_id}
                                        sx={{
                                            borderRadius: 1,
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                            "&.Mui-selected": {
                                                backgroundColor: theme.palette.action.selected,
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography 
                                                    sx={{ 
                                                        color: theme.palette.text.primary,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {formatBoldText(note.note_title)}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    sx={{ color: theme.palette.text.secondary }}
                                                    variant="body2"
                                                >
                                                    {new Date(note.created_at).toLocaleDateString()}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default ChatSidebar;