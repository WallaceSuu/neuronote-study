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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Only send username update if it has changed
        if (formData.username !== userDetails.username) {
            try {
                const response = await axios.patch(
                    `${API_ENDPOINTS.EDIT_USERNAME}${formData.username}/`,
                    {},
                    axiosConfig
                );
                if (response.status === 200) {
                    console.log('Username updated successfully');
                    window.location.reload();
                } else {
                    console.error('Error changing username:', response.data.error);
                }
            } catch (error) {
                console.error('Error changing username:', error);
            }
        }

        // TODO: Implement password change
        console.log('Form submitted:', formData);
        onClose();
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
                        />
                        <TextField
                            label="New Password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            fullWidth
                            type="password"
                        />
                        <TextField
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                            type="password"
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