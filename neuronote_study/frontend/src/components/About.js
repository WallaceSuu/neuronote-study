import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, List, ListItem, useTheme, Grid, Avatar, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

// Styled components with enhanced effects
const GlassPaper = styled(Paper)(({ theme }) => ({
  background: `rgba(255, 255, 255, 0.1)`,
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease-in-out",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
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

const FeatureIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main + '20',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '2rem',
    color: theme.palette.primary.main,
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
      icon: <AutoStoriesIcon />,
      delay: 0.4,
    },
    {
      title: "Easy Organization",
      description: "Keep your research materials organized with our intuitive interface. Access your notes, flashcards, and PDFs all in one place.",
      icon: <SchoolIcon />,
      delay: 0.6,
    },
    {
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions and insights from our AI system that helps you understand complex concepts and relationships in your research.",
      icon: <PsychologyIcon />,
      delay: 0.8,
    },
    {
      title: "Advanced Flashcards",
      description: "Track your learning progress with our flashcards that are generated from your notes. Perfect for exam preparation and concept review.",
      icon: <LightbulbIcon />,
      delay: 1,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: 6 }}>
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <GradientText variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
            About Neuronote Study
          </GradientText>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Transforming the way you study with AI-powered tools and intelligent organization
          </Typography>
        </Box>
      </motion.div>

      {/* Features Grid */}
      <Grid container spacing={4} sx={{ mb: 8, justifyContent: 'center' }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index} sx={{ maxWidth: '600px' }}>
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <GlassPaper sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <FeatureIcon>
                    {feature.icon}
                  </FeatureIcon>
                </Box>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    color: "primary.main",
                    fontWeight: "medium",
                    mb: 2
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8
                  }}
                >
                  {feature.description}
                </Typography>
              </GlassPaper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Team Section */}
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <GlassPaper sx={{ mt: 6, position: "relative", overflow: "hidden", maxWidth: "800px", mx: "auto" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                mr: 3
              }}
            >
              W
            </Avatar>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom sx={{ color: "primary.main" }}>
                About the Team
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Wallace S.
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Queen's University, Computer Engineering
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            Hi, I'm Wallace! I am a third year student at Queen's University in Canada, currently studying Computer Engineering. 
            I have a passion for building full stack applications and creating tools that make a difference in people's lives.
            Neuronote Study is my attempt to improve the way students interact with their study materials using 
            modern AI technology and intuitive design. As a student, I know how important it is to have the right tools to help you learn.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            This project combines my interests in artificial intelligence and web development technology 
            to create a powerful study tool that helps students learn more effectively.
          </Typography>
        </GlassPaper>
      </motion.div>
    </Container>
  );
};

export default About;
