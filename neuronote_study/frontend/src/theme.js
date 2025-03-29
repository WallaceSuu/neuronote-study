import { createTheme } from "@mui/material/styles";

// Create a modern, futuristic theme with dark background and bright accents
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3", // Bright blue
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#fff",
    },
    secondary: {
      main: "#00bcd4", // Cyan
      light: "#4dd0e1",
      dark: "#0097a7",
      contrastText: "#fff",
    },
    background: {
      default: "#000000",
      paper: "#121212",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#03a9f4",
    },
    success: {
      main: "#4caf50",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 300,
      letterSpacing: "0.02em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 300,
      letterSpacing: "0.02em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 400,
      letterSpacing: "0.02em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 400,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "8px 16px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(33, 150, 243, 0.3)",
            transform: "translateY(-1px)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #1976d2, #2196f3)",
          "&:hover": {
            background: "linear-gradient(45deg, #1565c0, #1976d2)",
            boxShadow: "0px 4px 12px rgba(33, 150, 243, 0.5)",
          },
        },
        outlined: {
          borderColor: "rgba(33, 150, 243, 0.5)",
          "&:hover": {
            borderColor: "#2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
          borderRadius: 8,
          boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          overflow: "hidden",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
        },
        rounded: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.15)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(33, 150, 243, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196f3",
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#000000",
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#959595",
            },
        },
      },
    },
  },
});

export default theme;
