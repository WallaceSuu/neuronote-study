import React from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
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
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {currentPage > 1 && (
          <IconButton
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
            minWidth: '60px',
            textAlign: 'center',
            fontWeight: 'medium',
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
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  );
};

export default NotebookNavigation;



