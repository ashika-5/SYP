import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Menu, MenuItem, Divider, Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Navbar = () => {
  const navigate = useNavigate();
  const isPatientLoggedIn = localStorage.getItem("isPatientLoggedIn") === "true";
  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientEmail = localStorage.getItem("patientEmail") || "";
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("isPatientLoggedIn");
    localStorage.removeItem("patientName");
    localStorage.removeItem("patientEmail");
    setAnchorEl(null);
    navigate("/");
  };

  const initials = patientName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(15,23,42,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 70 } }}>
        {/* Logo */}
        <Box
          component={Link} to="/"
          sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none", flexGrow: 1 }}
        >
          <Box sx={{
            width: 36, height: 36, borderRadius: 2, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
          }}>
            <LocalHospitalIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{
              color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px", lineHeight: 1,
              fontFamily: "'Georgia', serif",
            }}>
              Medi<Box component="span" sx={{ color: "#60a5fa" }}>Care</Box>
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Health Portal
            </Typography>
          </Box>
        </Box>

        {/* Nav Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Button
            component={Link} to="/"
            sx={{
              color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, px: 2, borderRadius: 2,
              "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.07)" }, transition: "all 0.2s",
            }}
          >
            Hospitals
          </Button>

          {isPatientLoggedIn ? (
            <>
              <Button
                component={Link} to="/patient/dashboard"
                sx={{
                  color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, px: 2, borderRadius: 2,
                  "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.07)" }, transition: "all 0.2s",
                }}
              >
                My Dashboard
              </Button>

              {/* Avatar Menu */}
              <Box
                onClick={e => setAnchorEl(e.currentTarget)}
                sx={{
                  ml: 1, display: "flex", alignItems: "center", gap: 1, cursor: "pointer",
                  bgcolor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, px: 1.5, py: 0.6, transition: "all 0.2s",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.25)" },
                }}
              >
                <Avatar sx={{
                  width: 30, height: 30, fontSize: 12, fontWeight: 700,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                }}>
                  {initials}
                </Avatar>
                <Typography sx={{ color: "white", fontSize: 13, fontWeight: 600, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {patientName.split(" ")[0]}
                </Typography>
                <KeyboardArrowDownIcon sx={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }} />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    borderRadius: 3, mt: 1.5, minWidth: 220,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    overflow: "visible",
                    "&::before": {
                      content: '""', position: "absolute", top: -6, right: 20,
                      width: 12, height: 12, bgcolor: "background.paper",
                      transform: "rotate(45deg)", borderTop: "1px solid rgba(0,0,0,0.08)",
                      borderLeft: "1px solid rgba(0,0,0,0.08)",
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{
                      width: 40, height: 40, background: "linear-gradient(135deg, #3b82f6, #6366f1)", fontSize: 14, fontWeight: 700,
                    }}>{initials}</Avatar>
                    <Box>
                      <Typography fontWeight={700} fontSize={14} color="#0f172a">{patientName}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>{patientEmail}</Typography>
                    </Box>
                  </Box>
                  <Chip label="Patient" size="small" sx={{ mt: 1.5, bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 600, fontSize: 11 }} />
                </Box>
                <Divider />
                <MenuItem onClick={() => { navigate("/patient/dashboard"); setAnchorEl(null); }}
                  sx={{ gap: 1.5, mx: 1, my: 0.5, borderRadius: 2, py: 1.2 }}>
                  <DashboardIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  <Typography fontWeight={500} fontSize={14}>My Dashboard</Typography>
                </MenuItem>
                <MenuItem onClick={() => { navigate("/patient/dashboard"); setAnchorEl(null); }}
                  sx={{ gap: 1.5, mx: 1, my: 0.5, borderRadius: 2, py: 1.2 }}>
                  <PersonIcon sx={{ fontSize: 18, color: "#6366f1" }} />
                  <Typography fontWeight={500} fontSize={14}>My Profile</Typography>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout}
                  sx={{ gap: 1.5, mx: 1, mb: 0.5, borderRadius: 2, py: 1.2, "&:hover": { bgcolor: "#fff1f2" } }}>
                  <LogoutIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                  <Typography fontWeight={600} fontSize={14} color="#ef4444">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link} to="/patient/login"
                sx={{
                  color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, px: 2, borderRadius: 2,
                  "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.07)" }, transition: "all 0.2s",
                }}
              >
                Login
              </Button>
              <Button
                component={Link} to="/patient/login"
                variant="contained"
                sx={{
                  ml: 0.5, borderRadius: 2.5, px: 2.5, py: 0.9, fontWeight: 700, fontSize: 14,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  boxShadow: "0 4px 14px rgba(59,130,246,0.45)",
                  "&:hover": { background: "linear-gradient(135deg, #2563eb, #4f46e5)", transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(59,130,246,0.5)" },
                  transition: "all 0.2s",
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
