import React, { useState, useRef } from "react";
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

const SubmitPDF = () => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

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

    // Creating a new formdata object to send the files to the server
    const formData = new FormData();

    // Appending each file submitted to the formdata object
    files.forEach((file) => {
      formData.append("pdf_file", file);
    });

    // Sending the formdata object to the server via axios post request
    try {
      const response = await axios.post(
        API_ENDPOINTS.UPLOAD_PDF,
        formData,
        axiosConfig
      );
      console.log(response.data);
      alert("PDF uploaded successfully");
      window.location.href = "/notes";
      setFiles([]); // Clear the files after successful upload
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload PDF");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 3,
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
          mb: 4,
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
            mt: 3,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.05)",
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
    </Container>
  );
};

export default SubmitPDF;
