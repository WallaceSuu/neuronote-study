import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS, getCSRFToken } from '../config';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '../context/ThemeContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const { isDarkMode } = useThemeContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${API_ENDPOINTS.BASE_URL}/api/password-reset/`,
                { email },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken(),
                    },
                }
            );
            setSuccess('Password reset link has been sent to your email.');
            setEmail('');
        } catch (error) {
            console.error('Password reset error:', error);
            setError(error.response?.data?.error || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container component="main" maxWidth="xs" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100%',
                }}
            >
                <Typography variant="h4" sx={{ mb: 3 }}>Forgot Password?</Typography>
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                    Enter your email address and we'll send you instructions to reset your password.
                </Typography>
                <Button
                    onClick={() => navigate("/login")}
                    color="primary"
                >
                    Back to Login
                </Button>
                
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        error={!!error}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default ForgotPassword;
            
        
