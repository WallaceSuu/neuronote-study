import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, List, ListItem, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

// Styled components with futuristic effects
const GlassPaper = styled(Paper)(({ theme }) => ({
  background: `rgba(255, 255, 255, 0.1)`,
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease-in-out",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
    background: `rgba(255, 255, 255, 0.15)`,
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundSize: "200% 200%",
  animation: "gradient 5s ease infinite",
  "@keyframes gradient": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));

const About = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Smart Summarization",
      description: "The AI model will analyze your PDFs and provide concise, meaningful summaries that capture the important parts of your notes.",
      delay: 0.4,
    },
    {
      title: "Easy Organization",
      description: "Keep your research materials organized with our intuitive interface",
      delay: 0.6,
    },
    {
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions and insights from our AI system that helps you understand complex concepts and relationships in your research.",
      delay: 0.8,
    },
    {
      title: "Advanced Flashcards",
      description: "Track your learning progress with our flashcards that are generated from your notes.",
      delay: 1,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
      <Box sx={{ my: 6 }}>
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <GradientText variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
              About Neuronote Study
            </GradientText>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Transforming the way you study with AI
            </Typography>
          </Box>
        </motion.div>

        {/* Features List */}
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <List>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: feature.delay }}
              >
                <ListItem sx={{ display: "block", mb: 3 }}>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      color: "primary.main",
                      fontWeight: "medium"
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Box>

        {/* Team Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <GlassPaper elevation={3} sx={{ p: 4, mt: 6, position: "relative", overflow: "hidden", maxWidth: "800px", mx: "auto" }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: "primary.main" }}>
              About the Team
            </Typography>
            <Typography variant="body1" paragraph>
              Hi, I'm Wallace I am a third year student at the Queen's University studying Computer Engineering with a passion for building full stack applications like the one you're currently using.
            </Typography>
          </GlassPaper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default About;
