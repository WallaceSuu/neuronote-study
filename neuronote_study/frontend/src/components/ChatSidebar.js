import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Divider, IconButton, useTheme, Tooltip, Fade } from '@mui/material';
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
            <Tooltip title={isOpen ? "Close sidebar" : "Open sidebar"} placement="right">
                <IconButton
                    onClick={onToggle}
                    sx={{
                        position: 'fixed',
                        left: isOpen ? 320 : 20,
                        top: '84px',
                        zIndex: 1200,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2],
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                            transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    <MenuIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>
            </Tooltip>
            <Drawer
                variant="persistent"
                anchor="left"
                open={isOpen}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 320,
                        backgroundColor: theme.palette.background.paper,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2],
                        top: '64px',
                        height: 'calc(100% - 64px)',
                        transition: 'all 0.3s ease-in-out',
                    },
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
                        Your Notes
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
                    {notes.length === 0 ? (
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
                                No notes available, please upload a PDF to create a note!
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
                            {notes.map((note) => (
                                <ListItem key={note.note_id} disablePadding>
                                    <ListItemButton
                                        onClick={() => onNoteSelect(note)}
                                        selected={selectedNote?.note_id === note.note_id}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            transition: 'all 0.2s ease-in-out',
                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                transform: 'translateX(4px)',
                                            },
                                            "&.Mui-selected": {
                                                backgroundColor: theme.palette.action.selected,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.selected,
                                                },
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
                                                        fontWeight: selectedNote?.note_id === note.note_id ? 600 : 400,
                                                    }}
                                                >
                                                    {formatBoldText(note.note_title)}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    sx={{ 
                                                        color: theme.palette.text.secondary,
                                                        fontSize: '0.875rem',
                                                    }}
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