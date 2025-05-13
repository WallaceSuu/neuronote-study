import React, { useState } from 'react';
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

const EditProfile = ({ open, onClose }) => {
    const theme = useThemeContext();
    const [formData, setFormData] = useState({
        email: 'john.doe@example.com',
        username: 'johndoe',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement form submission
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