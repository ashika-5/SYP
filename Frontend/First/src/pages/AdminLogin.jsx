import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PRIMARY = "#1976d2";
const PRIMARY_DARK = "#1565c0";

// Admin credentials
const ADMIN_EMAIL = "admin@medicare.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }
    if (form.email !== ADMIN_EMAIL || form.password !== ADMIN_PASSWORD) {
      setError("Invalid admin credentials.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin/dashboard");
    }, 1000);
  };

  const fieldSx = {
    mb: 2.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&.Mui-focused fieldset": { borderColor: PRIMARY },
    },
    "& label.Mui-focused": { color: PRIMARY },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d1b2a 0%, #1a2f4e 50%, #1565c0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(255,255,255,0.2)",
              mx: "auto",
              mb: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography variant="h5" color="white" fontWeight={800}>
            Admin Portal
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}
          >
            MediCare Hospital System
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            bgcolor: "rgba(255,255,255,0.97)",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={0.5} color="#0d2a2a">
            Administrator Login
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Restricted access — authorized personnel only
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: PRIMARY, fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: PRIMARY, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Hint box */}
          <Box
            sx={{
              mb: 2.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#e3f2fd",
              border: "1px solid rgba(25,118,210,0.2)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              <strong>Test credentials:</strong>
              <br />
              Email: <strong>admin@medicare.com</strong>
              <br />
              Password: <strong>admin123</strong>
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: 15,
              background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})`,
              boxShadow: "0 4px 16px rgba(25,118,210,0.3)",
              "&:hover": {
                background: `linear-gradient(90deg, #0d47a1, ${PRIMARY_DARK})`,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Login as Admin"
            )}
          </Button>

          <Typography
            variant="body2"
            align="center"
            mt={2.5}
            color="text.secondary"
          >
            Patient?{" "}
            <Link
              to="/patient/login"
              style={{ color: PRIMARY, fontWeight: 600 }}
            >
              Login here
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
