import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Navigation from "./Navigation";
import SubmitPDF from "./SubmitPDF";
import Notes from "./Notes";
import About from "./About";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Flashcards from "./Flashcards";
import Profile from "./Profile";
import ChatPage from "./ChatPage";
import { Box } from "@mui/material";
import { ThemeProvider } from "../context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <Navigation />
          <Box
            component="main"
            sx={{
              flex: 1,
              overflow: "auto",
              position: "relative",
              height: "calc(100vh - 64px)", // Subtract navigation height
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/submit" element={<SubmitPDF />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
