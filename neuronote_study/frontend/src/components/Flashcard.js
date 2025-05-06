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

const Flashcard = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINTS.FLASHCARDS}`);
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
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
    };

    const handlePreviousCard = () => {
        setShowAnswer(false);
        setCurrentCard((prev) => 
            prev === 0 ? flashcards.length - 1 : prev - 1
        );
    };

    const renderFlashcard = () => {
        if (!flashcards || flashcards.length === 0) {
            return (
                <Typography sx={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
                    No flashcards available.
                </Typography>
            );
        }

        const currentCard = flashcards[currentCard];

        return (
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        {currentCard.flashcard_title}
                    </Typography>
                </CardContent>
            </Card>
        )   
    }

    return (
        <div>
            flashcard
        </div>
    )
}

export default Flashcard;
