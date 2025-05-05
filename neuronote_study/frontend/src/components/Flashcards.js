import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Flashcards = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 4 }}>
                Flashcards
            </Typography>
        </Container>
    )
}
export default Flashcards;
