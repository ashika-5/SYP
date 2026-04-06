// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../context/AuthContext";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      login(null, true); // true = admin login
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, textAlign: "center" }}>
        <Box sx={{ mb: 4 }}>
          <LockIcon sx={{ fontSize: 60, color: "#1976d2" }} />
          <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
            Admin Login
          </Typography>
          <Typography color="text.secondary">Access Admin Dashboard</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 4, py: 1.5, borderRadius: 3, fontWeight: 600 }}
          >
            Login as Admin
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
          Default: username = <strong>admin</strong>, password ={" "}
          <strong>admin123</strong>
        </Typography>
      </Paper>
    </Container>
  );
}
