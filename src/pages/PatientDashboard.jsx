import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Grid, Paper, Avatar, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, LinearProgress,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AddIcon from "@mui/icons-material/Add";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", value: "dashboard", icon: <DashboardIcon fontSize="small" /> },
  { label: "My Appointments", value: "appointments", icon: <CalendarMonthIcon fontSize="small" /> },
  { label: "Find Hospitals", value: "hospitals", icon: <LocalHospitalIcon fontSize="small" /> },
  { label: "My Profile", value: "profile", icon: <PersonIcon fontSize="small" /> },
];

const STATUS_CONFIG = {
  Scheduled: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", label: "Upcoming" },
  Completed: { color: "#10b981", bg: "#f0fdf4", border: "#a7f3d0", label: "Completed" },
  Cancelled: { color: "#ef4444", bg: "#fff1f2", border: "#fecdd3", label: "Cancelled" },
};

const StatusChip = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.Scheduled;
  return (
    <Chip label={c.label} size="small" sx={{
      fontWeight: 700, fontSize: 11, height: 24,
      bgcolor: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }} />
  );
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);

  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientEmail = localStorage.getItem("patientEmail") || "";
  const patientId = localStorage.getItem("patientId") || "";
  const initials = patientName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    if (localStorage.getItem("isPatientLoggedIn") !== "true") {
      navigate("/patient/login");
      return;
    }
    const all = JSON.parse(localStorage.getItem("appointments") || "[]");
    // Only show appointments that belong to this patient (by patientId or email)
    const mine = all.filter(a =>
      a.patientId === patientId ||
      (a.email && a.email === patientEmail) ||
      (a.patientEmail && a.patientEmail === patientEmail)
    );
    setAppointments(mine);
  }, [navigate, patientId, patientEmail]);

  const handleLogout = () => {
    localStorage.removeItem("isPatientLoggedIn");
    localStorage.removeItem("patientName");
    localStorage.removeItem("patientEmail");
    localStorage.removeItem("patientId");
    navigate("/");
  };

  const scheduled = appointments.filter(a => a.status === "Scheduled").length;
  const completed = appointments.filter(a => a.status === "Completed").length;
  const cancelled = appointments.filter(a => a.status === "Cancelled").length;
  const totalSpent = appointments.reduce((s, a) => s + (a.amount || 500), 0);

  const stats = [
    { label: "Total Bookings", value: appointments.length, icon: <CalendarMonthIcon />, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Upcoming", value: scheduled, icon: <AccessTimeIcon />, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Completed", value: completed, icon: <CheckCircleIcon />, color: "#10b981", bg: "#f0fdf4" },
    { label: "Total Spent", value: `NPR ${totalSpent}`, icon: <TrendingUpIcon />, color: "#6366f1", bg: "#f5f3ff" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>

      {/* ─── Sidebar ─── */}
      <Box sx={{
        width: 260, flexShrink: 0, display: "flex", flexDirection: "column",
        background: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <Box sx={{ px: 3, pt: 3.5, pb: 3, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
            }}>
              <LocalHospitalIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "white", fontWeight: 800, fontSize: 18, fontFamily: "'Georgia', serif", lineHeight: 1 }}>
                Medi<Box component="span" sx={{ color: "#60a5fa" }}>Care</Box>
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
                Patient Portal
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Patient card */}
        <Box sx={{ p: 2.5, m: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{
              width: 42, height: 42, fontWeight: 700, fontSize: 16,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
            }}>{initials}</Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: "white", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {patientName}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {patientEmail}
              </Typography>
            </Box>
          </Box>
          <Chip label="Patient" size="small" sx={{ mt: 1.5, bgcolor: "rgba(59,130,246,0.25)", color: "#60a5fa", fontWeight: 600, fontSize: 11, height: 22 }} />
        </Box>

        {/* Nav items */}
        <Box sx={{ px: 1.5, flex: 1 }}>
          {SIDEBAR_ITEMS.map(({ label, value, icon }) => (
            <Box
              key={value}
              onClick={() => value === "hospitals" ? navigate("/") : setTab(value)}
              sx={{
                display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.4,
                borderRadius: 2.5, mb: 0.5, cursor: "pointer", transition: "all 0.2s",
                bgcolor: tab === value ? "rgba(59,130,246,0.2)" : "transparent",
                border: tab === value ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                "&:hover": { bgcolor: tab === value ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)" },
              }}
            >
              <Box sx={{ color: tab === value ? "#60a5fa" : "rgba(255,255,255,0.45)", display: "flex" }}>{icon}</Box>
              <Typography sx={{
                fontSize: 14, fontWeight: tab === value ? 700 : 400,
                color: tab === value ? "white" : "rgba(255,255,255,0.6)",
              }}>{label}</Typography>
              {tab === value && <Box sx={{ ml: "auto", width: 6, height: 6, borderRadius: "50%", bgcolor: "#3b82f6" }} />}
            </Box>
          ))}
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.07)", mx: 2 }} />

        {/* Logout */}
        <Box
          onClick={handleLogout}
          sx={{
            display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 2.5, cursor: "pointer",
            "&:hover": { bgcolor: "rgba(239,68,68,0.1)" }, transition: "all 0.2s",
          }}
        >
          <LogoutIcon sx={{ color: "#ef4444", fontSize: 20 }} />
          <Typography sx={{ color: "#ef4444", fontSize: 14, fontWeight: 600 }}>Sign Out</Typography>
        </Box>
      </Box>

      {/* ─── Main ─── */}
      <Box sx={{ flex: 1, p: { xs: 3, md: 4 }, overflow: "auto" }}>

        {/* Top bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0f172a", mb: 0.3 }}>
              {tab === "dashboard" && `Welcome back, ${patientName.split(" ")[0]} 👋`}
              {tab === "appointments" && "My Appointments"}
              {tab === "profile" && "My Profile"}
            </Typography>
            <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2.5, py: 1.2, px: 2.5, fontWeight: 700, textTransform: "none",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #2563eb)", transform: "translateY(-1px)" },
              transition: "all 0.2s",
            }}
          >
            New Appointment
          </Button>
        </Box>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <>
            {/* Stats */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {stats.map(s => (
                <Grid item xs={6} lg={3} key={s.label}>
                  <Paper elevation={0} sx={{
                    p: 3, borderRadius: 3.5, border: "1px solid #e2e8f0",
                    bgcolor: "white", transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 12px 40px rgba(0,0,0,0.08)", borderColor: s.color + "44" },
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                        {s.icon}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{s.value}</Typography>
                    <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.5 }}>{s.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Recent appointments */}
            <Paper elevation={0} sx={{ borderRadius: 3.5, border: "1px solid #e2e8f0", mb: 3, overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>Recent Appointments</Typography>
                <Button size="small" endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => setTab("appointments")}
                  sx={{ color: "#3b82f6", fontWeight: 600, textTransform: "none" }}>
                  View All
                </Button>
              </Box>
              {appointments.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography fontSize={48}>📭</Typography>
                  <Typography sx={{ color: "#64748b", mt: 1, mb: 2 }}>No appointments yet</Typography>
                  <Button variant="contained" onClick={() => navigate("/")}
                    sx={{ borderRadius: 2.5, background: "linear-gradient(135deg, #2563eb, #3b82f6)", textTransform: "none", fontWeight: 700 }}>
                    Book Your First Appointment
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        {["Doctor", "Hospital", "Date & Time", "Payment", "Amount", "Status"].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, py: 1.5 }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.slice(0, 5).map(a => (
                        <TableRow key={a.id} sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                          <TableCell sx={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{a.doctorName || "—"}</TableCell>
                          <TableCell sx={{ fontSize: 14, color: "#475569" }}>{a.hospitalName || "—"}</TableCell>
                          <TableCell sx={{ fontSize: 13, color: "#64748b" }}>
                            <Typography fontSize={13} fontWeight={600} color="#475569">{a.date || "—"}</Typography>
                            <Typography fontSize={12} color="#94a3b8">{a.preferredTime || ""}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={a.paymentMethod || "Cash"} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 11, height: 22 }} />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>NPR {a.amount || 500}</TableCell>
                          <TableCell><StatusChip status={a.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>

            {/* Quick actions */}
            <Paper elevation={0} sx={{ borderRadius: 3.5, border: "1px solid #e2e8f0", p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 2.5 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {[
                  { icon: "🏥", label: "Find Hospitals", sub: "Browse all hospitals", color: "#3b82f6", action: () => navigate("/") },
                  { icon: "📅", label: "My Bookings", sub: "View all appointments", color: "#6366f1", action: () => setTab("appointments") },
                  { icon: "👤", label: "My Profile", sub: "Account details", color: "#10b981", action: () => setTab("profile") },
                  { icon: "🚪", label: "Sign Out", sub: "Logout safely", color: "#ef4444", action: handleLogout },
                ].map(item => (
                  <Grid item xs={6} sm={3} key={item.label}>
                    <Box onClick={item.action} sx={{
                      p: 2.5, borderRadius: 3, cursor: "pointer",
                      border: "1.5px solid #e2e8f0", bgcolor: "white", textAlign: "center",
                      transition: "all 0.25s",
                      "&:hover": { borderColor: item.color + "66", bgcolor: item.color + "08", transform: "translateY(-3px)", boxShadow: `0 8px 24px ${item.color}22` },
                    }}>
                      <Typography fontSize={30}>{item.icon}</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a", mt: 1 }}>{item.label}</Typography>
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.3 }}>{item.sub}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </>
        )}

        {/* ── APPOINTMENTS TAB ── */}
        {tab === "appointments" && (
          <Paper elevation={0} sx={{ borderRadius: 3.5, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>All Appointments</Typography>
                <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.3 }}>{appointments.length} total • Showing only your appointments</Typography>
              </Box>
              <Button startIcon={<AddIcon />} variant="contained" onClick={() => navigate("/")}
                sx={{ borderRadius: 2.5, background: "linear-gradient(135deg, #2563eb, #3b82f6)", textTransform: "none", fontWeight: 700 }}>
                Book New
              </Button>
            </Box>

            {appointments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <EventBusyIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0f172a", mb: 1 }}>No appointments found</Typography>
                <Typography sx={{ color: "#64748b", mb: 3 }}>You haven't booked any appointments yet</Typography>
                <Button variant="contained" onClick={() => navigate("/")}
                  sx={{ borderRadius: 2.5, background: "linear-gradient(135deg, #2563eb, #3b82f6)", textTransform: "none", fontWeight: 700 }}>
                  Find a Doctor
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      {["Doctor", "Hospital", "Date", "Time", "Payment", "Amount", "Status"].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, py: 1.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map(a => (
                      <TableRow key={a.id} sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{a.doctorName || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 14, color: "#475569" }}>{a.hospitalName || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 13, color: "#475569" }}>{a.date || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 13, color: "#475569" }}>{a.preferredTime || "—"}</TableCell>
                        <TableCell>
                          <Chip label={a.paymentMethod || "Cash"} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 11, height: 22 }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>NPR {a.amount || 500}</TableCell>
                        <TableCell><StatusChip status={a.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <>
            <Paper elevation={0} sx={{ borderRadius: 3.5, border: "1px solid #e2e8f0", overflow: "hidden", mb: 3 }}>
              <Box sx={{ height: 100, background: "linear-gradient(135deg, #0f172a, #1e3a5f, #1d4ed8)" }} />
              <Box sx={{ px: 4, pb: 4, mt: -5 }}>
                <Avatar sx={{
                  width: 80, height: 80, fontSize: 28, fontWeight: 800, mb: 2,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  border: "4px solid white", boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                }}>{initials}</Avatar>
                <Typography sx={{ fontWeight: 800, fontSize: 24, color: "#0f172a" }}>{patientName}</Typography>
                <Typography sx={{ color: "#64748b", fontSize: 15, mb: 1 }}>{patientEmail}</Typography>
                <Chip label="Patient Account" size="small" sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700 }} />
              </Box>
            </Paper>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              {[
                { label: "Total Appointments", value: appointments.length, color: "#3b82f6", bg: "#eff6ff" },
                { label: "Upcoming", value: scheduled, color: "#f59e0b", bg: "#fffbeb" },
                { label: "Completed", value: completed, color: "#10b981", bg: "#f0fdf4" },
                { label: "Cancelled", value: cancelled, color: "#ef4444", bg: "#fff1f2" },
              ].map(s => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e2e8f0", textAlign: "center" }}>
                    <Typography sx={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>{s.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Paper elevation={0} sx={{ borderRadius: 3.5, border: "1.5px solid #fecdd3", bgcolor: "#fff1f2", p: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#991b1b", mb: 0.5 }}>Sign Out</Typography>
              <Typography sx={{ color: "#dc2626", fontSize: 14, mb: 2 }}>
                You'll be logged out and redirected to the homepage. Your data stays safe.
              </Typography>
              <Button variant="contained" startIcon={<LogoutIcon />} onClick={handleLogout}
                sx={{ bgcolor: "#ef4444", borderRadius: 2.5, fontWeight: 700, textTransform: "none", px: 3,
                  "&:hover": { bgcolor: "#dc2626", boxShadow: "0 4px 14px rgba(239,68,68,0.4)" } }}>
                Sign Out
              </Button>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
}
