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

const NoteSidebar = ({ selectedNote, onNoteSelect }) => {
  // Placeholder data - replace this with your actual data later
  const notes = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      date: "2024-03-20",
      text: "sample text 1",
    },
    {
      id: 2,
      title: "Neural Networks Basics",
      date: "2024-03-19",
      text: "sample text 2",
    },
    {
      id: 3,
      title: "Deep Learning Fundamentals",
      date: "2024-03-18",
      text: "sample text 3",
    },
    {
      id: 4,
      title: "Computer Vision Applications",
      date: "2024-03-17",
      text: "sample text 4",
    },
    {
      id: 5,
      title: "Natural Language Processing",
      date: "2024-03-16",
      text: "sample text 5",
    },
  ];

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
                      {note.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                      variant="body2"
                    >
                      {note.date}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default NoteSidebar;
