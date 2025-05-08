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
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NeuronIcon from "@mui/icons-material/Psychology";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

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
  background: "rgba(10, 10, 20, 0.7)",
  backdropFilter: "blur(10px)",
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    axios.post(`${API_ENDPOINTS.LOGOUT}`)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
      localStorage.removeItem('authToken');
      window.location.reload();
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
              to="/analytics"
              color="inherit"
              active={location.pathname === "/analytics"}
            >
              Analytics
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <GlowIconButton color="inherit">
              <DarkModeIcon />
            </GlowIconButton>
            <GlowIconButton color="inherit">
              <NotificationsIcon />
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </GlassAppBar>
    </HideOnScroll>
  );
};

export default Navigation;
