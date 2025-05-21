import React from 'react';
import { Box, IconButton, Typography, Paper, Fade } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';


const NotebookNavigation = ({ currentPage, totalPages, onPageChange, refreshPages }) => {
  const theme = useTheme();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleCreatePage = async () => {
    try {
      const response = await axios.post(API_ENDPOINTS.CREATE_NOTEBOOK_PAGE, {
        page_title: `Page ${totalPages + 1}`,
        page_number: totalPages + 1
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        onPageChange(totalPages + 1);
        refreshPages();
      }
    } catch (error) {
      console.error('Error creating notebook page:', error);
    }
  };

  const handleDeletePage = async (pageNumber) => {
    try {
      // First get the page ID for the current page number
      const pagesResponse = await axios.get(API_ENDPOINTS.NOTEBOOK_PAGES, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      // Find the page with the matching page number from the pages array
      const page = pagesResponse.data.pages.find(p => p.page_number === pageNumber);
      if (!page) {
        console.error('Page not found');
        return;
      }

      // Now delete using the actual page ID
      const response = await axios.post(`${API_ENDPOINTS.DELETE_NOTEBOOK_PAGE}/${page.id}/`, {}, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const nextPageNumber = response.data.next_page_number;
        onPageChange(nextPageNumber);
        refreshPages();
      }
    } catch (error) {
      console.error('Error deleting notebook page:', error);
    }
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.6)',
          }
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '0.75rem 1.5rem',
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50px',
            border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8],
            }
          }}
        >
          {currentPage > 1 && (
            <IconButton
              sx={{
                color: theme.palette.error.light,
                '&:hover': {
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
              onClick={() => handleDeletePage(currentPage)}
            >
              <RemoveIcon />
            </IconButton>
          )}
          <IconButton
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={handlePreviousPage}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              minWidth: '80px',
              textAlign: 'center',
              fontWeight: 'medium',
              letterSpacing: '0.5px',
              fontSize: '1.1rem',
            }}
          >
            Page {currentPage}/{totalPages}
          </Typography>

          <IconButton
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={handleNextPage}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          <IconButton
            sx={{
              color: theme.palette.success.light,
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={handleCreatePage}
          >
            <AddIcon />
          </IconButton>
        </Paper>
      </Box>
    </Fade>
  );
};

export default NotebookNavigation;



