import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import NoteSidebar from "./NoteSidebar";
import Note from "./Note";
import axios from "axios";
import { API_ENDPOINTS, axiosConfig } from "../config";

const Notes = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.NOTES}`, axiosConfig);
        setNotes(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
          {error}
        </Typography>
      ) : notes.length === 0 ? (
        <Typography
          sx={{ textAlign: "center", mt: 4, color: "rgba(255, 255, 255, 0.7)" }}
        >
          No notes found. Upload a PDF to create your first note!
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ flex: 1 }}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{ height: "100%" }}>
            <NoteSidebar
              notes={notes}
              selectedNote={selectedNote}
              onNoteSelect={setSelectedNote}
            />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9} sx={{ height: "100%" }}>
            <Note selectedNote={selectedNote} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Notes;
