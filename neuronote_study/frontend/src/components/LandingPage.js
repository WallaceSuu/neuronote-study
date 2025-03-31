import React from "react";
import { Box, Typography, Container, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "#000",
        minHeight: "calc(100vh - 64px)", // Account for the height of the navigation bar
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            mb: 4,
            textAlign: "center",
            background: "linear-gradient(90deg, #00bcd4, #2196f3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px rgba(33, 150, 243, 0.3)",
          }}
        >
          Neuronote Study
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 6,
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Transform your lecture slides into interactive study materials
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4 }}>
          <Button
            variant="contained"
            component={Link}
            to="/submit"
            size="large"
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "translateY(-2px)",
                boxShadow: "0 5px 15px rgba(33, 150, 243, 0.3)",
              },
              transition: "all 0.2s",
              boxShadow: "0 3px 8px rgba(33, 150, 243, 0.2)",
              px: 4,
              py: 1.5,
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/about"
            size="large"
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              "&:hover": {
                borderColor: theme.palette.secondary.light,
                backgroundColor: "rgba(0, 188, 212, 0.08)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s",
              px: 4,
              py: 1.5,
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
