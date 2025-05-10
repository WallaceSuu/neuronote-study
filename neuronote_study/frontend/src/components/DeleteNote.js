import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { API_ENDPOINTS, axiosConfig } from '../config';

const DeleteNote = ({ noteId, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${API_ENDPOINTS.BASE_URL}/api/delete-note/${noteId}/`,
        axiosConfig
      );

      if (response.status === 200) {
        onDelete(noteId);
        setOpen(false);
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      if (err.response) {
        setError(`Failed to delete note: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to delete note. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton 
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        size="small"
        sx={{
          color: 'rgba(255, 255, 255, 0.5)',
          '&:hover': {
            color: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Delete Note</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Are you sure you want to delete this note? This action cannot be undone.
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            disabled={loading}
            variant="contained"
            color="error"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteNote;