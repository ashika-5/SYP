// src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { currentUser, isAdmin, logout } = useAuth();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1976d2" }}>
      <Toolbar>
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

        {/* Show only for non-admin pages */}
        {!isAdminRoute && (
          <>
            <Button color="inherit" component={Link} to="/">
              Hospitals
            </Button>
            <Button color="inherit" component={Link} to="/doctor/101">
              Doctors
            </Button>
          </>
        )}

        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          {isAdmin ? (
            <Button color="inherit" variant="outlined" onClick={logout}>
              Logout Admin
            </Button>
          ) : currentUser ? (
            <>
              <Button color="inherit" component={Link} to="/patient">
                My Dashboard
              </Button>
              <Button color="inherit" variant="outlined" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/patient/login">
                Patient Login
              </Button>
              <Button
                color="inherit"
                variant="outlined"
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
