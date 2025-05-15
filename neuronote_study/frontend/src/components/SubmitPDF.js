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
      const response = await axios.post(API_ENDPOINTS.UPLOAD_PDF, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}`
        },
      });
      alert("PDF uploaded successfully");
      window.location.href = "/notes";
      setFile(null);
      setIsLoading(false);
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
      <Container maxWidth="md" sx={{ py: 4 }}>
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
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #00bcd4, #2196f3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px rgba(33, 150, 243, 0.3)",
          }}
        >
          Submit PDF
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#aaa",
          }}
        >
          Upload your lecture slide PDF for analysis
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
            transition: "all 0.2s ease",
            minHeight: "250px",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              boxShadow: "0 0 15px rgba(33, 150, 243, 0.2)",
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {!file ? (
            <>
              <CloudUploadIcon
                sx={{
                  fontSize: 64,
                  mb: 2,
                  opacity: 0.9,
                  color: theme.palette.primary.main,
                }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Drag & Drop PDF File Here
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 3, textAlign: "center", color: "#aaa" }}
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
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 15px rgba(33, 150, 243, 0.3)",
                  },
                  transition: "all 0.2s",
                  boxShadow: "0 3px 8px rgba(33, 150, 243, 0.2)",
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
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <InsertDriveFileIcon
                sx={{ fontSize: 32, color: theme.palette.primary.light }}
              />
              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                {file.name}
              </Typography>
              <Button
                size="small"
                onClick={handleRemoveFile}
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          )}
        </Paper>

        {file && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{
                backgroundColor: "#1565c0",
                "&:hover": {
                  backgroundColor: "#0d47a1",
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(21, 101, 192, 0.3)",
                },
                transition: "all 0.2s",
                boxShadow: "0 3px 8px rgba(21, 101, 192, 0.2)",
                minWidth: "150px",
                position: "relative",
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "white",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                  <span style={{ visibility: "hidden" }}>Process File</span>
                </>
              ) : (
                "Process File"
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SubmitPDF;
