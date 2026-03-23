
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}
        >
          Doctor Appointment System
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Hospitals
        </Button>

        <Button color="inherit" component={Link} to="/admin/dashboard">
          Admin Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
