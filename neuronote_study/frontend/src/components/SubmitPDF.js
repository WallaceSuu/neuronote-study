import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Stack,
  useTheme,
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
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length === 0) {
      alert("Please upload PDF files only.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
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
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length === 0) {
      alert("Please upload PDF files only.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle file submission
  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload at least one PDF file.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to upload files.");
      return;
    }

    // Creating a new formdata object to send the files to the server
    const formData = new FormData();

    // Appending each file submitted to the formdata object
    files.forEach((file) => {
      console.log("Adding file to FormData:", file.name);
      formData.append("pdf_file", file);
    });

    // Debug: Check what's in the FormData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Sending the formdata object to the server via axios post request
    try {
      console.log("Sending request to:", API_ENDPOINTS.UPLOAD_PDF);
      const response = await axios.post(API_ENDPOINTS.UPLOAD_PDF, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          "Content-Type": "multipart/form-data",
          "Authorization": `Token ${token}`
        },
      });
      console.log(response.data);
      alert("PDF uploaded successfully");
      window.location.href = "/notes";
      setFiles([]); // Clear the files after successful upload
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        alert("Failed to upload PDF");
      }
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
          Upload your lecture slide PDFs for analysis
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
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              boxShadow: "0 0 15px rgba(33, 150, 243, 0.2)",
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 64,
              mb: 2,
              opacity: 0.9,
              color: theme.palette.primary.main,
            }}
          />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Drag & Drop PDF Files Here
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
            Select PDF Files
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              name="pdf_file"
            />
          </Button>
        </Paper>

        {files.length > 0 && (
          <Paper
            sx={{
              p: 3,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              border: "1px solid rgba(255, 255, 255, 0.05)",
              maxHeight: "400px",
              overflow: "auto",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Uploaded Files ({files.length})
            </Typography>
            <Stack spacing={1}>
              {files.map((file, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InsertDriveFileIcon
                      sx={{ mr: 1, color: theme.palette.primary.light }}
                    />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {file.name}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      color: "white",
                      "&:hover": {
                        color: theme.palette.secondary.main,
                        background: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Paper>
              ))}
            </Stack>
            {files.length > 0 && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    mt: 2,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                      transform: "translateY(-2px)",
                      boxShadow: "0 5px 15px rgba(0, 188, 212, 0.3)",
                    },
                    transition: "all 0.2s",
                    boxShadow: "0 3px 8px rgba(0, 188, 212, 0.2)",
                  }}
                >
                  Process Files
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default SubmitPDF;
