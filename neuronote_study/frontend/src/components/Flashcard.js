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
    useTheme,
    Fade,
    Zoom,
} from "@mui/material";
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import { useThemeContext } from '../context/ThemeContext';

const Flashcard = () => {
    const theme = useTheme();
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
                <Fade in timeout={500}>
                    <Typography 
                        sx={{ 
                            textAlign: "center", 
                            color: theme.palette.text.secondary,
                            p: 3,
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: 2,
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        No flashcards available.
                    </Typography>
                </Fade>
            );
        }

        const currentFlashcard = flashcards[currentCard];

        return (
            <Fade in timeout={500}>
                <Card 
                    sx={{ 
                        maxWidth: 600, 
                        mx: 'auto', 
                        my: 2,
                        backgroundColor: theme.palette.background.paper,
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2],
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: theme.shadows[4],
                            transform: 'translateY(-2px)',
                        },
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 3,
                                color: theme.palette.text.primary,
                                fontWeight: 500,
                                fontSize: '1.25rem',
                                lineHeight: 1.4,
                                textAlign: 'center',
                            }}
                        >
                            {currentFlashcard.question}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {currentFlashcard.answers && currentFlashcard.answers.map((answer, index) => {
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
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: hoverBg,
                                                borderColor: theme.palette.divider,
                                                transform: 'translateX(4px)',
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
                    <CardActions 
                        sx={{ 
                            justifyContent: 'space-between', 
                            px: 2, 
                            pb: 2,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.action.hover,
                        }}
                    >
                        <Button 
                            onClick={handlePreviousCard}
                            variant="outlined"
                            sx={{
                                color: theme.palette.text.primary,
                                borderColor: theme.palette.divider,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.selected,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        >
                            Previous
                        </Button>
                        <Button 
                            onClick={handleNextCard}
                            variant="outlined"
                            sx={{
                                color: theme.palette.text.primary,
                                borderColor: theme.palette.divider,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.selected,
                                    borderColor: theme.palette.divider,
                                },
                            }}
                        >
                            Next
                        </Button>
                    </CardActions>
                </Card>
            </Fade>
        );
    };

    if (loading) {
        return (
            <Fade in timeout={500}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100%',
                }}>
                    <CircularProgress size={40} />
                </Box>
            </Fade>
        );
    }

    return (
        <Container sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            {renderFlashcard()}
        </Container>
    );
};

export default Flashcard;
