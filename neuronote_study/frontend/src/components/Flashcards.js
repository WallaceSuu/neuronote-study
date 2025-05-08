import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

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

  const handleNextCard = async () => {
    setShowAnswer(false);
    
    // If we're at the last card, generate a new one
    if (currentCardIndex === flashcards.length - 1) {
      setIsGenerating(true);
      try {
        const response = await axios.post(
          `${API_ENDPOINTS.GENERATE_FLASHCARDS}`,
          { note_id: selectedNote.note_id },
          axiosConfig
        );
        if (response.data.flashcard) {
          setFlashcards(prev => [...prev, response.data.flashcard]);
        }
      } catch (err) {
        console.error("Error generating new flashcard:", err);
        setError("Failed to generate new flashcard. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }
    
    setCurrentCardIndex((prev) => (prev + 1));
  };

  const handlePreviousCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => 
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
  };

  const handleGenerateFlashcards = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.GENERATE_FLASHCARDS}`,
        { note_id: selectedNote.note_id },
        axiosConfig
      );
      if (response.data.flashcard) {
        setFlashcards([response.data.flashcard]);
        setCurrentCardIndex(0);
      }
    } catch (err) {
      console.error("Error generating flashcards:", err);
      setError("Failed to generate flashcards. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const renderFlashcard = () => {
    if (!selectedNote) {
      return (
        <Typography sx={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
          Select a note to view its flashcards
        </Typography>
      );
    }

    if (loading || isGenerating) {
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
            onClick={handleGenerateFlashcards}
            disabled={isGenerating}
            sx={{ 
              backgroundColor: "rgba(33, 150, 243, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.9)",
              }
            }}
          >
            {isGenerating ? "Generating..." : "Generate flashcards from these notes"}
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
        <CardContent>
          <Typography variant="h5" sx={{ textAlign: "center", color: "white", mb: 3 }}>
            {currentCard.question}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {currentCard.answers && currentCard.answers.map((answer, index) => (
              <Button
                key={index}
                variant="outlined"
                fullWidth
                sx={{
                  mb: 1,
                  backgroundColor: selectedAnswer === answer 
                    ? (answer.is_correct ? '#4caf50' : '#f44336')
                    : 'transparent',
                  color: selectedAnswer === answer ? 'white' : 'inherit',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: selectedAnswer === answer 
                      ? (answer.is_correct ? '#388e3c' : '#d32f2f')
                      : 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                onClick={() => handleAnswerClick(answer)}
              >
                {answer.text}
              </Button>
            ))}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button 
            onClick={handlePreviousCard}
            variant="outlined"
            disabled={isGenerating}
            sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
          >
            Previous
          </Button>
          <Box>
            {currentCardIndex+1}/{flashcards.length}
          </Box>
          <Button 
            onClick={handleNextCard}
            variant="outlined"
            disabled={isGenerating}
            sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
          >
            {isGenerating ? "Generating..." : "Next"}
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", mt: "64px" }}>
      <FlashcardSidebar
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
          renderFlashcard()
        )}
      </Box>
    </Box>
  );
};

export default Flashcards;
