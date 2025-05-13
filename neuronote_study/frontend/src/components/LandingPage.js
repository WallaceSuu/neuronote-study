import React from "react";
import { Box, Typography, Container, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.text.primary,
        minHeight: "100%",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            mb: 4,
            textAlign: "center",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 20px ${theme.palette.primary.main}33`, // 33 = 0.2 alpha
          }}
        >
          Neuronote Study
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 6,
            textAlign: "center",
            color: theme.palette.text.secondary,
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
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                transform: "translateY(-2px)",
                boxShadow: `0 5px 15px ${theme.palette.primary.main}33`,
              },
              transition: "all 0.2s",
              boxShadow: `0 3px 8px ${theme.palette.primary.main}22`,
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
                backgroundColor: theme.palette.secondary.light + '14', // 14 = 8% alpha
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
