import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Stack, Container, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

const Note = ({ selectedNote }) => {
  const themeContext = useThemeContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const formatBoldText = (text) => {
    if (!text) return "";
    // Remove surrounding quotes if they exist
    const cleanText = text.trim().replace(/^["']|["']$/g, '');
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} style={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  const formatNoteText = (text) => {
    if (!text) return "";
    // Split the text into sections based on headers
    const sections = text.split(/(?=###)/);
    return sections.map((section, index) => {
      // Split each section into lines and preserve empty lines
      const lines = section.split(/\n/);
      return (
        <Box key={index} sx={{ mb: 3 }}>
          {lines.map((line, lineIndex) => {
            // Preserve empty lines
            if (line.trim() === '') {
              return <Box key={lineIndex} sx={{ height: '1em' }} />;
            }
            // Handle different types of content
            if (line.startsWith('###')) {
              return (
                <Typography
                  key={lineIndex}
                  variant="h6"
                  sx={{ color: theme.palette.text.primary, mb: 2, mt: 3 }}
                >
                  {line.replace('###', '').trim()}
                </Typography>
              );
            } else if (line.startsWith('-')) {
              // Process bold text within bullet points
              const parts = line.replace('-', '').split(/(\*\*.*?\*\*)/g);
              return (
                <Typography
                  key={lineIndex}
                  variant="body1"
                  sx={{ color: theme.palette.text.primary, ml: 2, mb: 1 }}
                >
                  • {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <span key={partIndex} style={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                          {part.slice(2, -2)}
                        </span>
                      );
                    }
                    return part;
                  })}
                </Typography>
              );
            } else {
              // Process bold text in regular lines
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <Typography
                  key={lineIndex}
                  variant="body1"
                  sx={{ 
                    color: theme.palette.text.primary, 
                    mb: 1,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <span key={partIndex} style={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                          {part.slice(2, -2)}
                        </span>
                      );
                    }
                    return part;
                  })}
                </Typography>
              );
            }
          })}
        </Box>
      );
    });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 4,
            backgroundColor: theme.palette.background.paper,
            backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : undefined,
            borderRadius: 2,
            border: `1px dashed ${theme.palette.primary.main}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            Please log in to view notes
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/register")}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Register
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : undefined,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        p: 3,
        maxWidth: "100%",
        mx: "auto",
        overflow: "hidden",
      }}
    >
      {selectedNote ? (
        <>
          <Typography variant="h5" sx={{ mb: 3, color: theme.palette.text.primary }}>
            {formatBoldText(selectedNote.note_title)}
          </Typography>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {formatNoteText(selectedNote.note_text)}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            Select a note from the sidebar
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Note;
