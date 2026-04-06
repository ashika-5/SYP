// src/pages/PatientLogin.jsx
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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../context/AuthContext";

export default function PatientLogin() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { registerPatient, loginPatient } = useAuth(); // ← Correct function names

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "register") {
        if (!form.fullName || !form.email || !form.password) {
          setError("All fields are required");
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (form.password.length < 6) {
          setError("Password must be at least 6 characters long");
          return;
        }

        registerPatient(form.fullName, form.email, form.password);
        setSuccess("Account created successfully! Please login.");
        setMode("login"); // Switch to login mode
        setForm({ ...form, password: "", confirmPassword: "" });
      } else {
        // Login Mode
        if (!form.email || !form.password) {
          setError("Email and password are required");
          return;
        }

        loginPatient(form.email, form.password);
        navigate("/patient"); // Go to patient dashboard
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={6} sx={{ p: 6, borderRadius: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <PersonIcon sx={{ fontSize: 60, color: "#1976d2" }} />
          <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
            {mode === "login" ? "Patient Login" : "Create New Account"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => newMode && setMode(newMode)}
          fullWidth
          sx={{ mb: 4 }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              margin="normal"
              required
            />
          )}

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          {mode === "register" && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 4, py: 1.5, borderRadius: 3, fontWeight: 600 }}
          >
            {mode === "login" ? "Login" : "Create Account"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
