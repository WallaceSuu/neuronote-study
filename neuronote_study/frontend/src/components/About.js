import React from "react";
import { Container, Typography, Box } from "@mui/material";

const About = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Neuronote Study
        </Typography>
        <Typography variant="body1" component="p">
          Neuronote Study is a platform that allows you to upload your PDF files
          and get a summary of the content.
        </Typography>
        <Typography variant="body1" component="p"></Typography>
      </Box>
    </Container>
  );
};

export default About;
