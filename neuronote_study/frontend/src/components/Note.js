import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const Note = ({ selectedNote }) => {
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
        p: 3,
      }}
    >
      {selectedNote ? (
        <>
          <Typography variant="h5" sx={{ mb: 3, color: "white" }}>
            {selectedNote.title}
          </Typography>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {selectedNote.text}
            </Typography>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Select a note from the sidebar
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Note;
