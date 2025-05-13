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

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };
    
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* User Info Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <Avatar sx={{ width: 100, height: 100 }}>JD</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4">John Doe</Typography>
                        <Typography variant="subtitle1" color="text.secondary">@johndoe</Typography>
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
                            <Typography variant="h4">5</Typography>
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
                            <Typography variant="h4">12</Typography>
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
                            <Typography variant="h4">25</Typography>
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
    );
};

export default Profile;
