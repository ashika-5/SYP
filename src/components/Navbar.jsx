// src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { currentUser, isAdmin, logout } = useAuth();

  // Check current route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1976d2", boxShadow: 3 }}>
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}
        >
          <LocalHospitalIcon sx={{ fontSize: 32 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: "white", textDecoration: "none", fontWeight: 700 }}
          >
            Arogya Nepal
          </Typography>
        </Box>

        {/* Navigation Links - Show only relevant ones */}
        {!isAdminRoute && (
          <>
            <Button color="inherit" component={Link} to="/">
              Hospitals
            </Button>
            <Button color="inherit" component={Link} to="/hospital/1/doctors">
              Doctors
            </Button>
          </>
        )}

        {/* Right Side - Dynamic Buttons */}
        <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
          {isAdminRoute ? (
            // ---------- ADMIN VIEW ----------
            isAdmin ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={logout}
                sx={{ borderColor: "white", color: "white" }}
              >
                Logout Admin
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to="/admin/login"
                sx={{ borderColor: "white", color: "white" }}
              >
                Admin Login
              </Button>
            )
          ) : // ---------- PATIENT VIEW ----------
          currentUser ? (
            <>
              <Button color="inherit" component={Link} to="/patient">
                My Dashboard
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={logout}
                sx={{ borderColor: "white", color: "white" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/patient/login">
                Patient Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to="/admin/login"
              >
                Admin Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
