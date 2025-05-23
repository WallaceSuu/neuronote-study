import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  Fade,
  Zoom,
} from "@mui/material";
import FlashcardSidebar from "./FlashcardSidebar";
import axios from "axios";
import { API_ENDPOINTS, axiosConfig } from "../config";

const Flashcards = () => {
  const theme = useTheme();
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
          setRefreshTrigger(prev => prev + 1);
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
        setRefreshTrigger(prev => prev + 1);
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
        <Typography sx={{ textAlign: "center", color: theme.palette.text.secondary }}>
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
          <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            No flashcards available for this note.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleGenerateFlashcards}
            disabled={isGenerating}
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
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
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardActions 
          sx={{ 
            justifyContent: "space-between", 
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.action.hover,
          }}
        >
          <Button 
            onClick={handlePreviousCard}
            variant="outlined"
            disabled={isGenerating}
            sx={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}
          >
            Previous
          </Button>
          <Box sx={{ color: theme.palette.text.primary }}>
            {currentCardIndex+1}/{flashcards.length}
          </Box>
          <Button 
            onClick={handleNextCard}
            variant="outlined"
            disabled={isGenerating}
            sx={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}
          >
            {isGenerating ? "Generating..." : "Next"}
          </Button>
        </CardActions>
        <CardContent sx={{ flex: 1, overflow: "auto", p: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              textAlign: "center", 
              color: theme.palette.text.primary, 
              mb: 3,
              fontSize: "1.25rem",
              fontWeight: 500,
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              textShadow: theme.palette.mode === 'dark' ? "0 1px 2px rgba(0,0,0,0.1)" : undefined
            }}
          >
            {currentCard.question}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {currentCard.answers && currentCard.answers.map((answer, index) => {
              const isSelected = selectedAnswer === answer;
              const isCorrect = answer.is_correct;
              let bgColor = theme.palette.background.paper;
              let color = theme.palette.text.primary;
              let hoverBg = theme.palette.action.hover;
              if (isSelected) {
                bgColor = isCorrect ? theme.palette.success.main : theme.palette.error.main;
                color = theme.palette.getContrastText(bgColor);
                hoverBg = isCorrect ? theme.palette.success.dark : theme.palette.error.dark;
              }
              return (
                <Button
                  key={index}
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    backgroundColor: bgColor,
                    color: color,
                    borderColor: theme.palette.divider,
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    '&:hover': {
                      backgroundColor: hoverBg,
                      borderColor: theme.palette.divider,
                    },
                  }}
                  onClick={() => handleAnswerClick(answer)}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <Box sx={{ 
                      minWidth: '24px',
                      mr: 1.5,
                      fontWeight: 600,
                      color: isSelected
                        ? color
                        : theme.palette.text.secondary
                    }}>
                      {String.fromCharCode(65 + index)}.
                    </Box>
                    {answer.text}
                  </Box>
                </Button>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ 
      display: "flex", 
      height: "calc(100vh - 64px)", 
      mt: "64px",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden"
    }}>
      <FlashcardSidebar
        notes={notes}
        selectedNote={selectedNote}
        onNoteSelect={setSelectedNote}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        refreshTrigger={refreshTrigger}
      />
      
      <Box
        sx={{
          flexGrow: 1,
          ml: isSidebarOpen ? '320px' : 0,
          transition: 'all 0.3s ease-in-out',
          p: isSidebarOpen ? 8 : 9,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {loading && !selectedNote ? (
          <Fade in={loading} timeout={500}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              height: "100%",
            }}>
              <CircularProgress size={40} />
            </Box>
          </Fade>
        ) : error && !selectedNote ? (
          <Fade in={!!error} timeout={500}>
            <Typography 
              color="error" 
              sx={{ 
                textAlign: "center", 
                mt: 4,
                p: 3,
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderRadius: 2,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              {error}
            </Typography>
          </Fade>
        ) : notes.length === 0 ? (
          <Fade in={notes.length === 0} timeout={500}>
            <Box sx={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 2
            }}>
              <Typography
                sx={{ 
                  textAlign: "center", 
                  color: theme.palette.text.secondary,
                  fontSize: "1.2rem"
                }}
              >
                No notes found. Upload a PDF to create your first set of flashcards!
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Fade in={!!selectedNote} timeout={500}>
            <Box sx={{ height: "100%" }}>
              {renderFlashcard()}
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default Flashcards;
