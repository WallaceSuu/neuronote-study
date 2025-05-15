import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#2196f3',
          },
          secondary: {
            main: '#B6E7FF',
          },
          text: {
            primary: isDarkMode ? '#F5F5F5' : '#212121',
            secondary: isDarkMode ? '#b0b0b0' : '#666666',
          },
          background: {
            default: isDarkMode ? '#121212' : '#ffffff',
            paper: isDarkMode ? '#1e1e1e' : '#ffffff',
            nav: isDarkMode ? 'rgba(10, 10, 20, 0.7)' : '#f5f5f5', // Custom nav bar color
            sidebar: isDarkMode ? 'rgba(255,255,255,0.08)' : '#fafafa', // Custom sidebar color
          },
          divider: isDarkMode ? 'rgba(255,255,255,0.05)' : '#222', // Dark grey border in light mode
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: isDarkMode ? 'rgba(10, 10, 20, 0.7)' : '#f5f5f5',
                backdropFilter: isDarkMode ? 'blur(10px)' : undefined,
                borderBottom: isDarkMode
                  ? '1px solid rgba(33, 150, 243, 0.2)'
                  : '1px solid #222',
                boxShadow: isDarkMode
                  ? '0 4px 20px rgba(33, 150, 243, 0.2)'
                  : '0 2px 8px #0000000a',
                '& .MuiTypography-root': {
                  color: isDarkMode ? '#ffffff' : '#000000',
                },
                '& .MuiButton-root': {
                  color: isDarkMode ? '#ffffff' : '#000000',
                },
                '& .MuiIconButton-root': {
                  color: isDarkMode ? '#ffffff' : '#000000',
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#fafafa',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #222',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #222',
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 