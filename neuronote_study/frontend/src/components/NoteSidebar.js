import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Drawer,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteNote from './DeleteNote';

const NoteSidebar = ({ notes, selectedNote, onNoteSelect, isOpen, onToggle, onNoteDelete }) => {
  const formatBoldText = (text) => {
    if (!text) return "";
    const cleanText = text.trim().replace(/^["']|["']$/g, '');
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} style={{ fontWeight: 'bold', color: 'white' }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  const handleDeleteClick = (event, noteId) => {
    event.stopPropagation(); // Prevent note selection when clicking delete
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
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          transition: 'left 0.2s ease-in-out',
        }}
      >
        <MenuIcon sx={{ color: 'white' }} />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'none',
            top: '64px',
            height: 'calc(100% - 64px)',
            transition: 'width 0.2s ease-in-out',
          },
        }}
      >
        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Notes
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {notes.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                textAlign: "center",
                mt: 2,
              }}
            >
              No notes available, please upload a PDF to create a note!
            </Typography>
          ) : (
            <List sx={{ flex: 1, overflow: "auto" }}>
              {notes.map((note) => (
                <ListItem 
                  key={note.note_id} 
                  disablePadding
                  secondaryAction={
                    <DeleteNote 
                      noteId={note.note_id} 
                      onDelete={onNoteDelete}
                    />
                  }
                  sx={{
                    '& .MuiListItemSecondaryAction-root': {
                      right: 8
                    }
                  }}
                >
                  <ListItemButton
                    onClick={() => onNoteSelect(note)}
                    selected={selectedNote?.note_id === note.note_id}
                    sx={{
                      borderRadius: 1,
                      pr: 6, // Add padding to prevent text from going under delete button
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          sx={{ 
                            color: "white",
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
                          sx={{ color: "rgba(255, 255, 255, 0.5)" }}
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

export default NoteSidebar;
