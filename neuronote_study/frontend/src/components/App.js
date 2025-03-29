import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LandingPage from "./LandingPage";
import Navigation from "./Navigation";
import theme from "../theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <LandingPage />
    </ThemeProvider>
  );
};

export default App;
