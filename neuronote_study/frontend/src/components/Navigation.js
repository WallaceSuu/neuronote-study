import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useScrollTrigger,
  Slide,
  Avatar,
  Menu,
  MenuItem,
  alpha,
  Divider,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NeuronIcon from "@mui/icons-material/Psychology";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useThemeContext } from "../context/ThemeContext";

// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Glass effect AppBar
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.nav,
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : undefined,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`
    : '0 2px 8px #0000000a',
}));

// Logo text with special styling
const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: "0.05em",
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

// NavButton with hover effect
const NavButton = styled(Button)(({ theme, active }) => ({
  borderRadius: "8px",
  padding: "6px 16px",
  margin: theme.spacing(0, 0.5),
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: active ? "80%" : 0,
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    transition: "all 0.3s ease",
    transform: "translateX(-50%)",
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    "&::after": {
      width: "80%",
    },
  },
}));

// Glowing icon button
const GlowIconButton = styled(IconButton)(({ theme }) => ({
  position: "relative",
  color: theme.palette.text.primary,
  margin: theme.spacing(0, 0.5),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "translateY(-2px)",
    "&::after": {
      opacity: 0.8,
      transform: "scale(1.2)",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    boxShadow: `0 0 15px ${theme.palette.primary.main}`,
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0.8)",
    transition: "all 0.2s ease-in-out",
    zIndex: -1,
  },
}));

const Navigation = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const { isDarkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const location = useLocation();

  useEffect(() => {
    // Fetch user information when component mounts
    const fetchUserInfo = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsLoggedIn(false);
        setUsername('');
        return;
      }

      try {
        const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/api/user/`, {
          headers: {
            'Authorization': `Token ${authToken}`
          }
        });
        setUsername(response.data.username);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          // If unauthorized, clear the auth token and username
          localStorage.removeItem('authToken');
          setUsername('');
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      axios.post(`${API_ENDPOINTS.LOGOUT}`, {}, {
        headers: {
          'Authorization': `Token ${authToken}`
        }
      })
      .then(() => {
        localStorage.removeItem('authToken');
        setUsername('');
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        // Even if the API call fails, clear local state
        localStorage.removeItem('authToken');
        setUsername('');
        window.location.href = '/login';
      });
    } else {
      // If no auth token, just redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <HideOnScroll>
      <GlassAppBar position="sticky">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: { xs: 1, md: 2 }, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <LogoText
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ textDecoration: "none" }}
            >
              <NeuronIcon sx={{ fontSize: 28 }} />
              NEURONOTE
            </LogoText>
          </Box>

          {/* Navigation Links - centered now that search is removed */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <NavButton
              component={RouterLink}
              to="/"
              color="inherit"
              active={location.pathname === "/"}
            >
              Dashboard
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/submit"
              color="inherit"
              active={location.pathname === "/submit"}
            >
              Submit PDF
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/notes"
              color="inherit"
              active={location.pathname === "/notes"}
            >
              Notes
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/flashcards"
              color="inherit"
              active={location.pathname === "/flashcards"}
            >
              Flashcards
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/chat"
              color="inherit"
              active={location.pathname === "/chat"}
            >
              Chat
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/notebook"
              color="inherit"
              active={location.pathname === "/notebook"}
            >
              Notebook
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/about"
              color="inherit"
              active={location.pathname === "/about"}
            >
              About
            </NavButton>
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {username && (
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {username}
              </Typography>
            )}
            <GlowIconButton color="inherit" onClick={toggleTheme}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </GlowIconButton>
            <GlowIconButton
              onClick={handleMenu}
              color="inherit"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <AccountCircleIcon />
            </GlowIconButton>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    backgroundColor: "background.paper",
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                },
              }}
            >
              {isLoggedIn ? (
                <>
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <Divider sx={{ borderColor: theme.palette.divider }} />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLogin}>Login</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </GlassAppBar>
    </HideOnScroll>
  );
};

export default Navigation;
