import React, { useState, useEffect } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import { API_ENDPOINTS, axiosConfig } from '../config';

const EditProfile = ({ open, onClose, userDetails }) => {
    const theme = useThemeContext();
    const [formData, setFormData] = useState({
        email: userDetails?.email || '',
        username: userDetails?.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Update formData on userDetails change
    useEffect(() => {
        if (userDetails) {
            setFormData(prev => ({
                ...prev,
                email: userDetails.email,
                username: userDetails.username
            }));
        }
    }, [userDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (name === 'username') setUsernameError('');
        if (name.includes('Password')) setPasswordError('');
    };

    const validatePasswordChange = () => {
        if (!formData.currentPassword) {
            setPasswordError('Current password is required');
            return false;
        }
        if (!formData.newPassword) {
            setPasswordError('New password is required');
            return false;
        }
        if (formData.newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters long');
            return false;
        }
        if (formData.newPassword === formData.currentPassword) {
            setPasswordError('New password cannot be the same as the current password');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return false;
        }
        if (formData.newPassword.length > 20) {
            setPasswordError('New password cannot be longer than 20 characters');
            return false;
        }
        if (formData.newPassword.includes(' ')) {
            setPasswordError('New password cannot contain spaces');
            return false;
        }
        
        // Check for password complexity
        const hasUpperCase = /[A-Z]/.test(formData.newPassword);
        const hasLowerCase = /[a-z]/.test(formData.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
        
        if (!hasUpperCase || !hasLowerCase || !hasSpecialChar) {
            setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one special character');
            return false;
        }

        return true;
    };

    const handleUsernameChange = async () => {
        if (formData.username === userDetails.username) return true;

        try {
            const response = await axios.patch(
                `${API_ENDPOINTS.EDIT_USERNAME}${formData.username}/`,
                {},
                axiosConfig
            );
            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            setUsernameError(error.response?.data?.error || 'Error changing username');
            return false;
        }
    };

    const handlePasswordChange = async () => {
        if (!formData.currentPassword && !formData.newPassword && !formData.confirmPassword) {
            return true;
        }

        if (!validatePasswordChange()) {
            return false;
        }

        try {
            const response = await axios.patch(
                API_ENDPOINTS.CHANGE_PASSWORD,
                {
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword,
                    confirm_password: formData.confirmPassword
                },
                axiosConfig
            );
            if (response.status === 200) {
                // Clear password fields after successful change
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
                return true;
            }
        } catch (error) {
            setPasswordError(error.response?.data?.error || 'Error changing password');
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError('');
        setPasswordError('');

        const usernameSuccess = await handleUsernameChange();
        const passwordSuccess = await handlePasswordChange();

        if (usernameSuccess && passwordSuccess) {
            window.location.reload();
            onClose();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Edit Profile
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {usernameError && (
                            <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 2, mb: 1, color: 'red' }}>
                                {usernameError}
                            </Typography>
                        )}
                        {passwordError && (
                            <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 2, mb: 1, color: 'red' }}>
                                {passwordError}
                            </Typography>
                        )}
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            type="email"
                            disabled
                        />
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            error={!!usernameError}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                            Change Password
                        </Typography>
                        <TextField
                            label="Current Password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            fullWidth
                            type="password"
                            error={!!passwordError}
                        />
                        <TextField
                            label="New Password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            fullWidth
                            type="password"
                            error={!!passwordError}
                        />
                        <TextField
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            type="password"
                            error={!!passwordError}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditProfile;