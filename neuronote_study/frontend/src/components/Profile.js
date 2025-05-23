import React, { useState, useEffect } from 'react';
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
    Paper,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteIcon from '@mui/icons-material/Note';
import SchoolIcon from '@mui/icons-material/School';
import EditProfile from './EditProfile';

const Profile = () => {
    const theme = useTheme();
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
        <Container maxWidth="lg" sx={{ 
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    mb: 4, 
                    width: '100%',
                    border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider}`,
                    borderRadius: 2
                }}
            >
                <Grid container spacing={3} alignItems="center" justifyContent="center">
                    <Grid item>
                        <Avatar sx={{ width: 100, height: 100 }}>JD</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4" align="center">{userDetails.username}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" align="center">{userDetails.email}</Typography>
                        <Typography variant="subtitle2" color="text.secondary" align="center">
                            {userDetails.is_active === true ? "Currently Online" : "Currently Offline"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleEditProfile}>
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Stats Overview */}
            <Grid 
                container 
                spacing={3} 
                sx={{ 
                    mb: 4, 
                    width: '100%', 
                    maxWidth: '900px',
                    mx: 'auto',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ 
                        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider}`,
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease-in-out',
                        width: '100%',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4],
                        }
                    }}>
                        <CardContent sx={{ 
                            textAlign: 'center',
                            width: '100%',
                            p: 3
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 2
                            }}>
                                <DescriptionIcon sx={{ 
                                    fontSize: '2rem',
                                    color: theme.palette.primary.main,
                                    mr: 1
                                }} />
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    PDFs
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ 
                                fontWeight: 600,
                                color: theme.palette.primary.main
                            }}>
                                {pdfs ? pdfs.length : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ 
                        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider}`,
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease-in-out',
                        width: '100%',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4],
                        }
                    }}>
                        <CardContent sx={{ 
                            textAlign: 'center',
                            width: '100%',
                            p: 3
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 2
                            }}>
                                <NoteIcon sx={{ 
                                    fontSize: '2rem',
                                    color: theme.palette.primary.main,
                                    mr: 1
                                }} />
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    Notes
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ 
                                fontWeight: 600,
                                color: theme.palette.primary.main
                            }}>
                                {notes ? notes.notes.length : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card sx={{ 
                        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider}`,
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease-in-out',
                        width: '100%',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4],
                        }
                    }}>
                        <CardContent sx={{ 
                            textAlign: 'center',
                            width: '100%',
                            p: 3
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 2
                            }}>
                                <SchoolIcon sx={{ 
                                    fontSize: '2rem',
                                    color: theme.palette.primary.main,
                                    mr: 1
                                }} />
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    Flashcards
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ 
                                fontWeight: 600,
                                color: theme.palette.primary.main
                            }}>
                                {flashcards ? flashcards.flashcards.length : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={3} sx={{ width: '100%' }}>
                {/* Recent PDFs */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2, 
                            height: '100%', 
                            position: 'relative',
                            border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider}`,
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center">Recent PDFs</Typography>
                        <Box sx={{ position: 'relative', maxHeight: '300px', overflow: 'hidden' }}>
                            <List disablePadding>
                                {pdfs && pdfs.slice(0, 3).map((pdf) => (
                                    <ListItem key={pdf.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <DescriptionIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <Typography noWrap sx={{ maxWidth: '200px' }}>
                                                    {pdf.pdf_name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography noWrap sx={{ maxWidth: '200px' }}>
                                                    {`Uploaded on ${new Date(pdf.created_at).toLocaleDateString()}`}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Notes */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2, 
                            height: '100%', 
                            position: 'relative',
                            border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider}`,
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center">Recent Notes</Typography>
                        <Box sx={{ position: 'relative', maxHeight: '300px', overflow: 'hidden' }}>
                            <List disablePadding>
                                {notes && notes.notes.slice(0, 3).map((note) => (
                                    <ListItem key={note.note_id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <NoteIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <Typography noWrap sx={{ maxWidth: '200px' }}>
                                                    {note.note_title.replace(/\*\*/g, '')}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography noWrap sx={{ maxWidth: '200px' }}>
                                                    {new Date(note.created_at).toLocaleString()}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Flashcards */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2, 
                            height: '100%', 
                            position: 'relative',
                            border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : theme.palette.divider}`,
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="h6" gutterBottom align="center">Recent Flashcards</Typography>
                        <Box sx={{ position: 'relative', maxHeight: '300px', overflow: 'hidden' }}>
                            <List disablePadding>
                                {flashcards && flashcards.flashcards.slice(0, 3).map((flashcard) => (
                                    <ListItem key={flashcard.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <SchoolIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <Typography noWrap sx={{ maxWidth: '200px' }}>
                                                    {flashcard.title.replace(/\*\*/g, '')}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography noWrap sx={{ maxWidth: '200px' }}>
                                                    {flashcard.question}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {userDetails && (
                <EditProfile 
                    open={isEditing} 
                    onClose={handleCloseEdit} 
                    userDetails={userDetails}
                />
            )}
        </Container>
    ) : (
        <Container maxWidth="lg" sx={{ 
            py: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            <Typography variant="h4" align="center">
                Unable to fetch user details, please try again later.
            </Typography>
        </Container>
    );
};

export default Profile;
