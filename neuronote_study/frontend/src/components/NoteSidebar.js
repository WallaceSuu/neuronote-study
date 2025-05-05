import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

const NoteSidebar = ({ notes, selectedNote, onNoteSelect }) => {
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

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
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
              <ListItem key={note.id} disablePadding>
                <ListItemButton
                  onClick={() => onNoteSelect(note)}
                  selected={selectedNote?.id === note.id}
                  sx={{
                    borderRadius: 1,
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
                      <Typography sx={{ color: "white" }}>
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
    </Paper>
  );
};

export default NoteSidebar;
