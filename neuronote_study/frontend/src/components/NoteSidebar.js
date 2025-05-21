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
  useTheme,
  Fade,
  Tooltip,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteNote from './DeleteNote';

const NoteSidebar = ({ notes, selectedNote, onNoteSelect, isOpen, onToggle, onNoteDelete }) => {
  const theme = useTheme();
  const formatBoldText = (text) => {
    if (!text) return "";
    const cleanText = text.trim().replace(/^\"|\"$/g, '');
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

  const handleDeleteClick = (event, noteId) => {
    event.stopPropagation(); // Prevent note selection when clicking delete
  };

  return (
    <>
      <Tooltip title={isOpen ? "Close sidebar" : "Open sidebar"}>
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
            transition: 'all 0.3s ease-in-out',
            width: 40,
            height: 40,
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
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
            },
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          height: '100%',
          gap: 2
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            Your Notes
          </Typography>
          <Divider sx={{ borderColor: theme.palette.divider }} />
          {notes.length === 0 ? (
            <Fade in={notes.length === 0} timeout={500}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                  mt: 2,
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
              '& .MuiListItem-root': {
                transition: 'all 0.2s ease-in-out',
              }
            }}>
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
                      pr: 6,
                      my: 0.5,
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
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          {formatBoldText(note.note_title)}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{ 
                            color: theme.palette.text.secondary,
                            fontSize: '0.8rem',
                            mt: 0.5
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

export default NoteSidebar;
