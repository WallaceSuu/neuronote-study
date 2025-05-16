import React from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTheme } from '@mui/material/styles';

const NotebookNavigation = () => {
  const theme = useTheme();

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
        <IconButton
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
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
          Page 1
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
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default NotebookNavigation;



