import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import FlashcardSidebar from "./FlashcardSidebar";
import axios from "axios";
import { API_ENDPOINTS, axiosConfig } from "../config";

const Flashcards = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flashcards, setFlashcards] = useState([]);

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

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!selectedNote) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_ENDPOINTS.GET_FLASHCARDS}${selectedNote.note_id}/`,
          axiosConfig
        );
        setFlashcards(response.data.flashcards);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setError("Failed to load flashcards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [selectedNote]);

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePreviousCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => 
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
  };

  const renderFlashcard = () => {
    if (!selectedNote) {
      return (
        <Typography sx={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
          Select a note to view its flashcards
        </Typography>
      );
    }

    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
          {error}
        </Typography>
      );
    }

    if (flashcards.length === 0) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}>
            No flashcards available for this note.
          </Typography>
          <Button 
            variant="contained" 
            onClick={async () => {
              try {
                const response = await axios.post(
                  `${API_ENDPOINTS.GENERATE_FLASHCARDS}`,
                  { note_id: selectedNote.note_id },
                  axiosConfig
                );
                setFlashcards(response.data.flashcard ? [response.data.flashcard] : []);
              } catch (err) {
                console.error("Error generating flashcards:", err);
                setError("Failed to generate flashcards. Please try again later.");
              }
            }}
            sx={{ 
              backgroundColor: "rgba(33, 150, 243, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.9)",
              }
            }}
          >
            Generate flashcards from these notes
          </Button>
        </Box>
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <Card 
        sx={{ 
          maxWidth: 600, 
          mx: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <CardContent sx={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h5" sx={{ textAlign: "center", color: "white" }}>
            {showAnswer ? currentCard.answer : currentCard.question}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button 
            onClick={handlePreviousCard}
            variant="outlined"
            sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
          >
            Previous
          </Button>
          <Button 
            onClick={() => setShowAnswer(!showAnswer)}
            variant="contained"
            sx={{ 
              backgroundColor: "rgba(33, 150, 243, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.9)",
              }
            }}
          >
            {showAnswer ? "Show Question" : "Show Answer"}
          </Button>
          <Button 
            onClick={handleNextCard}
            variant="outlined"
            sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
          >
            Next
          </Button>
        </CardActions>
      </Card>
    );
  };

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
        Flashcards
      </Typography>

      {loading && !selectedNote ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error && !selectedNote ? (
        <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
          {error}
        </Typography>
      ) : notes.length === 0 ? (
        <Typography
          sx={{ textAlign: "center", mt: 4, color: "rgba(255, 255, 255, 0.7)" }}
        >
          No notes found. Upload a PDF to create your first set of flashcards!
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ flex: 1 }}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{ height: "100%" }}>
            <FlashcardSidebar
              notes={notes}
              selectedNote={selectedNote}
              onNoteSelect={setSelectedNote}
            />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9} sx={{ height: "100%" }}>
            {renderFlashcard()}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Flashcards;
