import React, { useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import NoteSidebar from "./NoteSidebar";
import Note from "./Note";

const Notes = () => {
  const [selectedNote, setSelectedNote] = useState(null);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 3,
          background: "linear-gradient(90deg, #00bcd4, #2196f3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 20px rgba(33, 150, 243, 0.3)",
        }}
      >
        Your Notes
      </Typography>

      <Grid container spacing={3} sx={{ flex: 1 }}>
        {/* Sidebar */}
        <Grid item xs={12} md={3} sx={{ height: "100%" }}>
          <NoteSidebar
            selectedNote={selectedNote}
            onNoteSelect={setSelectedNote}
          />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9} sx={{ height: "100%" }}>
          <Note selectedNote={selectedNote} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Notes;
