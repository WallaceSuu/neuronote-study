import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, getCSRFToken } from "../config";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${API_ENDPOINTS.BASE_URL}/api/login/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
        }
      );

      if (response.data.token) {
        // Clear any existing token
        localStorage.removeItem("authToken");
        // Store the new token in localStorage
        localStorage.setItem("authToken", response.data.token);
        // Redirect to notes page
        navigate("/notes");
        window.location.reload();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              color: "#1a237e",
              fontWeight: "bold",
              marginBottom: 3,
            }}
          >
            Welcome Back
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#1a237e",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#1a237e",
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "linear-gradient(45deg, #1a237e 30%, #3949ab 90%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)",
                },
                borderRadius: "8px",
                padding: "12px",
                textTransform: "none",
                fontSize: "1.1rem",
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
