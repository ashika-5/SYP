import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("isPatientLoggedIn") === "true") {
      navigate("/patient/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    setError("");
    if (!loginForm.email || !loginForm.password) {
      setError("Please fill all fields.");
      return;
    }
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const found = patients.find(
      (p) => p.email === loginForm.email && p.password === loginForm.password,
    );
    if (!found) {
      setError("Invalid email or password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Store patient ID so we can isolate their appointments
      localStorage.setItem("isPatientLoggedIn", "true");
      localStorage.setItem("patientName", found.fullName);
      localStorage.setItem("patientEmail", found.email);
      localStorage.setItem("patientId", found.id);
      navigate("/patient/dashboard");
    }, 900);
  };

  const handleRegister = () => {
    setError("");
    setSuccess("");
    const { fullName, email, phone, password, confirmPassword } = registerForm;
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    if (patients.find((p) => p.email === email)) {
      setError("An account with this email already exists.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newPatient = {
        id: Date.now().toString(),
        fullName,
        email,
        phone,
        password,
      };
      localStorage.setItem(
        "patients",
        JSON.stringify([...patients, newPatient]),
      );
      setLoading(false);
      setSuccess("Account created! You can now log in.");
      setRegisterForm({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setTab(0);
    }, 900);
  };

  const inputSx = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      bgcolor: "#f8fafc",
      "&:hover fieldset": { borderColor: "#3b82f6" },
      "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 },
      "&.Mui-focused": { bgcolor: "white" },
      transition: "all 0.2s",
    },
    "& label.Mui-focused": { color: "#3b82f6" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.12)",
          top: -200,
          right: -200,
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.15)",
          bottom: -100,
          left: -100,
          filter: "blur(60px)",
        }}
      />

      {/* Left panel - hidden on mobile */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(59,130,246,0.4)",
            }}
          >
            <LocalHospitalIcon sx={{ color: "white", fontSize: 26 }} />
          </Box>
          <Typography
            sx={{
              color: "white",
              fontWeight: 800,
              fontSize: 28,
              fontFamily: "'Georgia', serif",
            }}
          >
            Medi
            <Box component="span" sx={{ color: "#60a5fa" }}>
              Care
            </Box>
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "white",
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 2,
            fontFamily: "'Georgia', serif",
          }}
        >
          Your health,
          <br />
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            our priority.
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: 380,
            mb: 6,
          }}
        >
          Access Nepal's best hospitals, book appointments with top specialists,
          and manage your health journey — all in one place.
        </Typography>

        {[
          { icon: "🏥", text: "9+ hospitals across Nepal" },
          { icon: "👨‍⚕️", text: "150+ verified specialists" },
          { icon: "⚡", text: "Instant appointment booking" },
          { icon: "🔒", text: "Your data is private & secure" },
        ].map((f) => (
          <Box
            key={f.text}
            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              {f.icon}
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
              {f.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Right panel - form */}
      <Box
        sx={{
          flex: { xs: 1, lg: "0 0 480px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalHospitalIcon sx={{ color: "white", fontSize: 22 }} />
            </Box>
            <Typography
              sx={{
                color: "white",
                fontWeight: 800,
                fontSize: 24,
                fontFamily: "'Georgia', serif",
              }}
            >
              Medi
              <Box component="span" sx={{ color: "#60a5fa" }}>
                Care
              </Box>
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => {
                setTab(v);
                setError("");
                setSuccess("");
              }}
              variant="fullWidth"
              sx={{
                bgcolor: "#f8fafc",
                "& .MuiTab-root": {
                  fontWeight: 700,
                  fontSize: 14,
                  py: 2.2,
                  textTransform: "none",
                  letterSpacing: 0,
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  bgcolor: "#3b82f6",
                },
                "& .Mui-selected": { color: "#3b82f6 !important" },
                "& .MuiTab-root:not(.Mui-selected)": { color: "#94a3b8" },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Create Account" />
            </Tabs>

            <Box sx={{ p: 4, bgcolor: "white" }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2.5 }}>
                  {success}
                </Alert>
              )}

              {tab === 0 && (
                <>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 22,
                      color: "#0f172a",
                      mb: 0.5,
                    }}
                  >
                    Welcome back 👋
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 14, mb: 3 }}>
                    Sign in to access your patient dashboard
                  </Typography>

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPass ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    sx={{ ...inputSx, mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPass(!showPass)}
                            edge="end"
                            size="small"
                          >
                            {showPass ? (
                              <VisibilityOffIcon sx={{ fontSize: 20 }} />
                            ) : (
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    disabled={loading}
                    endIcon={!loading && <ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2.5,
                      py: 1.6,
                      fontWeight: 700,
                      fontSize: 15,
                      textTransform: "none",
                      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                      boxShadow: "0 6px 20px rgba(37,99,235,0.4)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 28px rgba(37,99,235,0.5)",
                      },
                      "&:disabled": { background: "#e2e8f0" },
                      transition: "all 0.2s",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Typography
                    align="center"
                    sx={{ mt: 2.5, fontSize: 14, color: "#64748b" }}
                  >
                    No account yet?{" "}
                    <Box
                      component="span"
                      onClick={() => setTab(1)}
                      sx={{
                        color: "#3b82f6",
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": { color: "#1d4ed8" },
                      }}
                    >
                      Create one free
                    </Box>
                  </Typography>
                </>
              )}

              {tab === 1 && (
                <>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 22,
                      color: "#0f172a",
                      mb: 0.5,
                    }}
                  >
                    Join MediCare 🏥
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 14, mb: 3 }}>
                    Create your free patient account
                  </Typography>

                  <TextField
                    fullWidth
                    label="Full Name"
                    value={registerForm.fullName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        fullName: e.target.value,
                      })
                    }
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={registerForm.phone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setRegisterForm({ ...registerForm, phone: v });
                    }}
                    helperText="10 digits required"
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ maxLength: 10, inputMode: "numeric" }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPass ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    helperText="Minimum 6 characters"
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPass(!showPass)}
                            edge="end"
                            size="small"
                          >
                            {showPass ? (
                              <VisibilityOffIcon sx={{ fontSize: 20 }} />
                            ) : (
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    sx={{ ...inputSx, mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm(!showConfirm)}
                            edge="end"
                            size="small"
                          >
                            {showConfirm ? (
                              <VisibilityOffIcon sx={{ fontSize: 20 }} />
                            ) : (
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleRegister}
                    disabled={loading}
                    endIcon={!loading && <ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2.5,
                      py: 1.6,
                      fontWeight: 700,
                      fontSize: 15,
                      textTransform: "none",
                      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                      boxShadow: "0 6px 20px rgba(37,99,235,0.4)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": { background: "#e2e8f0" },
                      transition: "all 0.2s",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <Typography
                    align="center"
                    sx={{ mt: 2.5, fontSize: 14, color: "#64748b" }}
                  >
                    Already have an account?{" "}
                    <Box
                      component="span"
                      onClick={() => setTab(0)}
                      sx={{
                        color: "#3b82f6",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Sign in
                    </Box>
                  </Typography>
                </>
              )}
            </Box>
          </Paper>

          <Typography
            align="center"
            sx={{ mt: 2.5, fontSize: 13, color: "rgba(255,255,255,0.4)" }}
          >
            Admin?{" "}
            <Link
              to="/admin"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Admin Login →
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
