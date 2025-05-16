import React, { useEffect, useState, useRef } from "react";
import { Box, Paper, Typography, Button, Stack, Container, useTheme, Popover, IconButton, MenuItem, Select, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

const Note = ({ selectedNote }) => {
  const themeContext = useThemeContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selection, setSelection] = useState(null);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [notebookPage, setNotebookPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const noteRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({
        text: selection.toString(),
        range: range,
        rect: rect
      });
      setPopoverAnchor({
        left: rect.left + (rect.width / 2),
        top: rect.top - 10
      });
    } else {
      setSelection(null);
      setPopoverAnchor(null);
    }
  };

  const handleCreateNotebookNote = async (pageNumber, noteId, text) => {
    try {
      console.log('Creating notebook note with:', { pageNumber, noteId, text });
      console.log('Selected note:', selectedNote);

      const pageNumberInt = parseInt(pageNumber, 10);
      if (isNaN(pageNumberInt)) {
        throw new Error('Invalid page number');
      }

      // Check if noteId is undefined or null
      if (!noteId) {
        throw new Error('Note ID is required');
      }

      const noteIdInt = parseInt(noteId, 10);
      if (isNaN(noteIdInt)) {
        throw new Error(`Invalid note ID: ${noteId}`);
      }

      if (!text || typeof text !== 'string' || text.trim() === '') {
        throw new Error('Invalid text content');
      }

      const response = await axios.post(`${API_ENDPOINTS.CREATE_NOTEBOOK_NOTE}`, {
        page_number: pageNumberInt,
        note: noteIdInt,
        text: text.trim(),
        sidebar: true
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Notebook note created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating notebook note:', error);
      throw error;
    }
  };

  const handlePageSelect = async (pageNumber) => {
    if (selection && selectedNote) {
      try {
        console.log('Selected note in handlePageSelect:', selectedNote);
        if (!selectedNote.note_id) {
          throw new Error('Selected note has no ID');
        }
        await handleCreateNotebookNote(pageNumber, selectedNote.note_id, selection.text);
        setSelection(null);
        setPopoverAnchor(null);
      } catch (error) {
        console.error('Error creating notebook note:', error);
      }
    } else {
      console.error('Missing selection or selectedNote:', { selection, selectedNote });
    }
  };

  const highlightColors = [
    { color: '#ffeb3b', name: 'Yellow' },
    { color: '#a5d6a7', name: 'Green' },
    { color: '#90caf9', name: 'Blue' },
    { color: '#f48fb1', name: 'Pink' },
  ];

  const formatBoldText = (text) => {
    if (!text) return "";
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
    const sections = text.split(/(?=###)/);
    return sections.map((section, index) => {
      const lines = section.split(/\n/);
      return (
        <Box key={index} sx={{ mb: 3 }}>
          {lines.map((line, lineIndex) => {
            if (line.trim() === '') {
              return <Box key={lineIndex} sx={{ height: '1em' }} />;
            }
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
              const parts = line.replace('-', '').split(/(\*\*.*?\*\*)/g);
              return (
                <Typography
                  key={lineIndex}
                  variant="body1"
                  sx={{ color: theme.palette.text.primary, ml: 2, mb: 1 }}
                  onMouseUp={handleTextSelection}
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
                  onMouseUp={handleTextSelection}
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
      ref={noteRef}
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
        position: "relative",
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

      <Popover
        open={Boolean(popoverAnchor)}
        anchorReference="anchorPosition"
        anchorPosition={popoverAnchor}
        onClose={() => {
          setPopoverAnchor(null);
          setSelection(null);
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box sx={{ 
          p: 2, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: theme.shadows[3],
          minWidth: '200px',
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
            Add to Notebook Page:
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              value={notebookPage}
              onChange={(e) => setNotebookPage(e.target.value)}
              sx={{
                backgroundColor: theme.palette.background.default,
                '& .MuiSelect-select': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              {[...Array(totalPages)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  Page {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setPopoverAnchor(null);
                setSelection(null);
              }}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => handlePageSelect(notebookPage)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Add to Page
            </Button>
          </Box>
        </Box>
      </Popover>
    </Paper>
  );
};

export default Note;
