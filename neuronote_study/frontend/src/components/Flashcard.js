import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const Flashcard = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINTS.GET_FLASHCARDS}`);
                setFlashcards(response.data.flashcards);
            } catch (error) {
                console.error("Error fetching flashcards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcards();
    }, []);

    const handleNextCard = () => {
        setShowAnswer(false);
        setSelectedAnswer(null);
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
    };

    const handlePreviousCard = () => {
        setShowAnswer(false);
        setSelectedAnswer(null);
        setCurrentCard((prev) => 
            prev === 0 ? flashcards.length - 1 : prev - 1
        );
    };

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
        setShowAnswer(true);
    };

    const renderFlashcard = () => {
        if (!flashcards || flashcards.length === 0) {
            return (
                <Typography sx={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
                    No flashcards available.
                </Typography>
            );
        }

        const currentFlashcard = flashcards[currentCard];

        return (
            <Card sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {currentFlashcard.question}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        {currentFlashcard.answers && currentFlashcard.answers.map((answer, index) => (
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
                                    '&:hover': {
                                        backgroundColor: selectedAnswer === answer 
                                            ? (answer.is_correct ? '#388e3c' : '#d32f2f')
                                            : 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                                onClick={() => handleAnswerClick(answer)}
                            >
                                {answer.text}
                            </Button>
                        ))}
                    </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button onClick={handlePreviousCard}>Previous</Button>
                    <Button onClick={handleNextCard}>Next</Button>
                </CardActions>
            </Card>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            {renderFlashcard()}
        </Container>
    );
};

export default Flashcard;
