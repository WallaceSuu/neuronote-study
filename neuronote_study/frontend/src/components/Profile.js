import React, { useState, useEffect, createContext } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    CardActions,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteIcon from '@mui/icons-material/Note';
import SchoolIcon from '@mui/icons-material/School';
import EditProfile from './EditProfile';

const Profile = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [flashcards, setFlashcards] = useState(null);
    const [notes, setNotes] = useState(null);
    const [pdfs, setPDFs] = useState(null);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(API_ENDPOINTS.USER, {
                headers: {
                    'Authorization': `Token ${token}` 
                }
            });
            setUserDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchUserPDFs = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(API_ENDPOINTS.GET_USER_PDFS, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setPDFs(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user PDFs:', error);
        }
    };

    const fetchFlashcards = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(API_ENDPOINTS.GET_FLASHCARDS, {
                headers: {
                    'Authorization': `Token ${token}` 
                }
            });
            setFlashcards(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    };

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(API_ENDPOINTS.NOTES, {
                headers: {
                    'Authorization': `Token ${token}` 
                }
            });
            setNotes(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };
    

    useEffect(() => {
        fetchUserDetails();
        fetchUserPDFs();
        fetchFlashcards();
        fetchNotes();
    }, []);
    
    
    return userDetails !== null ? (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <Avatar sx={{ width: 100, height: 100 }}>JD</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4">{userDetails.username}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">{userDetails.email}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">{userDetails.is_active === true ? "Currently Online" : "Currently    Offline"}</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleEditProfile}>
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <DescriptionIcon sx={{ mr: 1 }} />
                                PDFs
                            </Typography>
                            <Typography variant="h4">{pdfs ? pdfs.length : 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <NoteIcon sx={{ mr: 1 }} />
                                Notes
                            </Typography>
                            <Typography variant="h4">{notes ? notes.notes.length : 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <SchoolIcon sx={{ mr: 1 }} />
                                Flashcards
                            </Typography>
                            <Typography variant="h4">{flashcards ? flashcards.flashcards.length : 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={3}>
                {/* Recent PDFs */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Recent PDFs</Typography>
                        <List>
                            {[1, 2, 3].map((item) => (
                                <ListItem key={item}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <DescriptionIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary="Sample PDF Document"
                                        secondary="Uploaded 2 days ago"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Notes */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Recent Notes</Typography>
                        <List>
                            {[1, 2, 3].map((item) => (
                                <ListItem key={item}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <NoteIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary="Study Notes"
                                        secondary="Created 1 day ago"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Flashcards */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Recent Flashcards</Typography>
                        <List>
                            {[1, 2, 3].map((item) => (
                                <ListItem key={item}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <SchoolIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary="Biology Chapter 1"
                                        secondary="Created 3 days ago"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <EditProfile open={isEditing} onClose={handleCloseEdit} />
        </Container>
    ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4">Unable to fetch user details, please try again later.</Typography>
        </Container>
    );
};

export default Profile;
