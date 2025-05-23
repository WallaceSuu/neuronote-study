import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, axiosConfig } from "../config";
import { useThemeContext } from "../context/ThemeContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.REGISTER,
        formData,
        axiosConfig
      );
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.");
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
            background: isDarkMode 
              ? "rgba(30, 30, 30, 0.95)" 
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              marginBottom: 3,
              textShadow: isDarkMode 
                ? "0 0 10px rgba(33, 150, 243, 0.3)"
                : "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Create Account
          </Typography>
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2,
                backgroundColor: isDarkMode 
                  ? "rgba(211, 47, 47, 0.2)"
                  : "rgba(211, 47, 47, 0.1)",
                padding: "8px 16px",
                borderRadius: "4px",
                width: "100%",
                textAlign: "center"
              }}
            >
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
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
                  backgroundColor: isDarkMode 
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.9)",
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode 
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.9)",
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="first_name"
              label="First Name"
              id="first_name"
              autoComplete="given-name"
              value={formData.first_name}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode 
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.9)",
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="last_name"
              label="Last Name"
              id="last_name"
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode 
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.9)",
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode 
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.9)",
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode 
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.9)",
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.primary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiInputBase-input": {
                  color: theme.palette.text.primary,
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
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  transform: "translateY(-1px)",
                  boxShadow: isDarkMode
                    ? "0 4px 8px rgba(33, 150, 243, 0.3)"
                    : "0 4px 8px rgba(0,0,0,0.2)",
                },
                borderRadius: "8px",
                padding: "12px",
                textTransform: "none",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
