import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Stack,
  useTheme,
  CircularProgress,
  Fade,
  Zoom,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import axios from "axios";
import { API_ENDPOINTS, axiosConfig } from "../config";
import { useNavigate } from "react-router-dom";

const SubmitPDF = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile || droppedFile.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    if (droppedFile.size > MAX_FILE_SIZE) {
      alert("File size must be less than 5MB.");
      return;
    }

    setFile(droppedFile);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
  };

  // Handle drag leave
  const handleDragLeave = () => {
    dropAreaRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  };

  // Handle file selection via button
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file submission
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!file) {
      alert("Please upload a PDF file.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to upload files.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", file);

    try {
      await axios.post(API_ENDPOINTS.UPLOAD_PDF, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}`
        },
      });
      navigate("/notes");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        alert("Failed to upload PDF");
      }
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4,
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Fade in={true} timeout={1000}>
          <Paper
            sx={{
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              border: "1px dashed rgba(33, 150, 243, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              width: "100%",
              maxWidth: "500px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 20px rgba(33, 150, 243, 0.2)",
              }
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Please log in to upload PDFs
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  backgroundColor: theme.palette.primary.main,
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
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                  },
                }}
              >
                Register
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 4,
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Fade in={true} timeout={1000}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 3,
          width: "100%",
          maxWidth: "800px"
        }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg, #00bcd4, #2196f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 20px rgba(33, 150, 243, 0.3)",
              textAlign: "center",
              mb: 2
            }}
          >
            Submit PDF
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#aaa",
              textAlign: "center",
              mb: 2
            }}
          >
            Upload a PDF file to analyze, e.g lecture slides, textbooks, etc.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              textAlign: "center",
              mb: 3,
              fontSize: "0.9rem"
            }}
          >
            Maximum file size: 5MB
          </Typography>

          <Paper
            ref={dropAreaRef}
            sx={{
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              border: "1px dashed rgba(33, 150, 243, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "all 0.3s ease",
              minHeight: "300px",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 0 20px rgba(33, 150, 243, 0.3)",
                transform: "translateY(-5px)",
              },
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!file ? (
              <Fade in={true} timeout={500}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  gap: 2
                }}>
                  <CloudUploadIcon
                    sx={{
                      fontSize: 80,
                      mb: 2,
                      opacity: 0.9,
                      color: theme.palette.primary.main,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        color: theme.palette.primary.light,
                      }
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1,
                      textAlign: "center",
                      fontWeight: 500
                    }}
                  >
                    Drag & Drop PDF File Here
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      mb: 3, 
                      textAlign: "center", 
                      color: "#aaa",
                      fontSize: "1rem"
                    }}
                  >
                    or
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 20px rgba(33, 150, 243, 0.4)",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                      padding: "10px 24px",
                      fontSize: "1rem"
                    }}
                  >
                    Select PDF File
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept=".pdf"
                      onChange={handleFileSelect}
                      name="pdf_file"
                    />
                  </Button>
                </Box>
              </Fade>
            ) : (
              <Fade in={true} timeout={500}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }
                }}>
                  <InsertDriveFileIcon
                    sx={{ 
                      fontSize: 40, 
                      color: theme.palette.primary.light,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      }
                    }}
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 500
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleRemoveFile}
                    sx={{
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Fade>
            )}
          </Paper>

          {file && (
            <Fade in={true} timeout={500}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "center",
                mt: 2
              }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: "#1565c0",
                    "&:hover": {
                      backgroundColor: "#0d47a1",
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 20px rgba(21, 101, 192, 0.4)",
                    },
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(21, 101, 192, 0.3)",
                    minWidth: "180px",
                    padding: "12px 32px",
                    fontSize: "1.1rem",
                    position: "relative",
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={28}
                        sx={{
                          color: "white",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-14px",
                          marginLeft: "-14px",
                        }}
                      />
                      <span style={{ visibility: "hidden" }}>Process File</span>
                    </>
                  ) : (
                    "Process File"
                  )}
                </Button>
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default SubmitPDF;
