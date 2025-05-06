import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.NOTES}`, axiosConfig);
        setNotes(response.data.notes);
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
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", mt: "64px" }}>
      <NoteSidebar
        notes={notes}
        selectedNote={selectedNote}
        onNoteSelect={setSelectedNote}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <Box
        sx={{
          flexGrow: 1,
          ml: isSidebarOpen ? '320px' : 0,
          transition: 'margin-left 0.2s ease-in-out',
          p: 3,
          height: '100%',
          overflow: 'auto',
        }}
      >
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
          <Note selectedNote={selectedNote} />
        )}
      </Box>
    </Box>
  );
};

export default Notes;
