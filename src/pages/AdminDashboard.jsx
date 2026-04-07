import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { hospitals as DEFAULT_HOSPITALS } from "../data/hospitals";
import { doctors as STATIC_DOCTORS } from "../data/doctors";

const PRIMARY = "#1976d2";
const PRIMARY_DARK = "#1565c0";
const PRIMARY_LIGHT = "#e3f2fd";
const BG = "#f0f7ff";

const load = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const StatusChip = ({ status }) => {
  const color =
    { Scheduled: "warning", Completed: "success", Cancelled: "error" }[
      status
    ] || "default";
  return (
    <Chip
      label={status || "Scheduled"}
      color={color}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

const SIDEBAR_ITEMS = [
  { label: "Dashboard", value: "dashboard", icon: <DashboardIcon /> },
  { label: "Hospitals", value: "hospitals", icon: <LocalHospitalIcon /> },
  { label: "Doctors", value: "doctors", icon: <PersonIcon /> },
  { label: "Appointments", value: "appointments", icon: <CalendarMonthIcon /> },
];

const EMPTY_FORM = {
  name: "",
  location: "",
  specialties: "",
  contact: "",
  specialty: "",
  hospitalId: "",
  experience: "",
  qualification: "",
  availability: "",
  bio: "",
  image: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") !== "true") navigate("/admin");
  }, [navigate]);

  const [tab, setTab] = useState("dashboard");
  const [adminDoctors, setAdminDoctors] = useState(() => load("doctors"));
  const [appointments, setAppointments] = useState(() => load("appointments"));
  const [modal, setModal] = useState({ open: false, type: "", item: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  const [hospitals, setHospitals] = useState(() => {
    const defaultIds = new Set(DEFAULT_HOSPITALS.map((h) => h.id));
    const extra = load("hospitals").filter((h) => !defaultIds.has(h.id));
    return [...DEFAULT_HOSPITALS, ...extra];
  });

  const allDoctors = [...STATIC_DOCTORS, ...adminDoctors];

  useEffect(() => {
    const defaultIds = new Set(DEFAULT_HOSPITALS.map((h) => h.id));
    localStorage.setItem(
      "hospitals",
      JSON.stringify(hospitals.filter((h) => !defaultIds.has(h.id))),
    );
    localStorage.setItem("doctors", JSON.stringify(adminDoctors));
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [hospitals, adminDoctors, appointments]);

  const openModal = (type, item = null) => {
    setForm(
      item
        ? {
            ...EMPTY_FORM,
            ...item,
            specialties: (item.specialties || []).join(", "),
          }
        : EMPTY_FORM,
    );
    setModal({ open: true, type, item });
  };

  const handleSave = () => {
    if (!form.name.trim()) return alert("Name is required");
    const isHospital = modal.type.includes("Hospital");
    const isAdd = modal.type.includes("add");
    if (isHospital) {
      const data = {
        id: isAdd ? Date.now() : modal.item.id,
        name: form.name,
        location: form.location,
        contact: form.contact || "N/A",
        specialties: form.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      setHospitals(
        isAdd
          ? [...hospitals, data]
          : hospitals.map((h) => (h.id === data.id ? data : h)),
      );
    } else {
      if (!form.hospitalId) return alert("Please select a hospital");
      const hospital = hospitals.find((h) => h.id === Number(form.hospitalId));
      if (!hospital) return alert("Hospital not found");
      const data = {
        id: isAdd ? Date.now() : modal.item.id,
        name: form.name,
        specialty: form.specialty,
        hospitalId: Number(form.hospitalId),
        hospitalName: hospital.name,
        experience: form.experience || "N/A",
        qualification: form.qualification || "N/A",
        availability: form.availability || "N/A",
        bio: form.bio,
        image: form.image,
      };
      setAdminDoctors(
        isAdd
          ? [...adminDoctors, data]
          : adminDoctors.map((d) => (d.id === data.id ? data : d)),
      );
    }
    setModal({ ...modal, open: false });
  };

  const handleDelete = (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    if (type === "hospital") setHospitals(hospitals.filter((h) => h.id !== id));
    if (type === "doctor")
      setAdminDoctors(adminDoctors.filter((d) => d.id !== id));
    if (type === "appointment")
      setAppointments(appointments.filter((a) => a.id !== id));
  };

  const scheduled = appointments.filter((a) => a.status === "Scheduled").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;

  const fieldSx = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&.Mui-focused fieldset": { borderColor: PRIMARY },
    },
    "& label.Mui-focused": { color: PRIMARY },
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: BG }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          background: `linear-gradient(180deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
          color: "white",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 3,
            pb: 2.5,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocalHospitalIcon sx={{ fontSize: 28 }} />
            <Typography fontWeight={800} fontSize={18} letterSpacing="-0.5px">
              Medi<span style={{ color: "#90caf9" }}>Care</span>
            </Typography>
          </Box>
          <Chip
            label="Admin Portal"
            size="small"
            sx={{
              mt: 1,
              bgcolor: "rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 11,
            }}
          />
        </Box>

        <Box
          sx={{ p: 3, pb: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <AdminPanelSettingsIcon />
            </Avatar>
            <Box>
              <Typography fontWeight={700} fontSize={14}>
                Administrator
              </Typography>
              <Typography
                fontSize={12}
                sx={{ color: "rgba(255,255,255,0.65)" }}
              >
                admin@medicare.com
              </Typography>
            </Box>
          </Box>
        </Box>

        <List sx={{ pt: 1.5, flex: 1 }}>
          {SIDEBAR_ITEMS.map(({ label, value, icon }) => (
            <ListItem
              key={value}
              onClick={() => setTab(value)}
              sx={{
                mx: 1.5,
                mb: 0.5,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor:
                  tab === value ? "rgba(255,255,255,0.18)" : "transparent",
                borderLeft:
                  tab === value ? "3px solid #90caf9" : "3px solid transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon
                sx={{
                  color: tab === value ? "white" : "rgba(255,255,255,0.6)",
                  minWidth: 36,
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: tab === value ? 700 : 400,
                  color: tab === value ? "white" : "rgba(255,255,255,0.7)",
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.12)", mx: 2 }} />
        <List sx={{ pb: 2 }}>
          <ListItem
            onClick={() => {
              localStorage.removeItem("isAdminLoggedIn");
              navigate("/admin");
            }}
            sx={{
              mx: 1.5,
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon sx={{ color: "rgba(255,255,255,0.6)", minWidth: 36 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
              }}
            />
          </ListItem>
        </List>
      </Box>

      {/* Main */}
      <Box sx={{ flex: 1, p: 4, overflow: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#0d2a2a"
              letterSpacing="-0.5px"
            >
              {tab === "dashboard" && "Dashboard Overview"}
              {tab === "hospitals" && "Manage Hospitals"}
              {tab === "doctors" && "Manage Doctors"}
              {tab === "appointments" && "All Appointments"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: PRIMARY, width: 44, height: 44 }}>
            <AdminPanelSettingsIcon />
          </Avatar>
        </Box>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  label: "Total Hospitals",
                  value: hospitals.length,
                  icon: "🏥",
                  color: PRIMARY,
                },
                {
                  label: "Total Doctors",
                  value: allDoctors.length,
                  icon: "👨‍⚕️",
                  color: "#7b1fa2",
                },
                {
                  label: "Upcoming",
                  value: scheduled,
                  icon: "⏰",
                  color: "#ed6c02",
                },
                {
                  label: "Completed",
                  value: completed,
                  icon: "✅",
                  color: "#2e7d32",
                },
              ].map((s) => (
                <Grid item xs={12} sm={6} md={3} key={s.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid rgba(25,118,210,0.1)",
                      boxShadow: "0 2px 16px rgba(25,118,210,0.06)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: 2,
                        bgcolor: `${s.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                      }}
                    >
                      {s.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color="#0d2a2a">
                        {s.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {s.label}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(25,118,210,0.1)",
                boxShadow: "0 2px 16px rgba(25,118,210,0.06)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#0d2a2a">
                  Recent Appointments
                </Typography>
                <Button
                  size="small"
                  onClick={() => setTab("appointments")}
                  sx={{ color: PRIMARY, fontWeight: 600 }}
                >
                  View All →
                </Button>
              </Box>
              {appointments.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <Typography fontSize={48}>📭</Typography>
                  <Typography color="text.secondary" mt={1}>
                    No appointments yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {[
                          "Patient",
                          "Doctor",
                          "Hospital",
                          "Date",
                          "Time",
                          "Status",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              fontWeight: 700,
                              color: "text.secondary",
                              fontSize: 12,
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.slice(0, 5).map((a) => (
                        <TableRow key={a.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {a.patientName || "—"}
                          </TableCell>
                          <TableCell>{a.doctorName || "—"}</TableCell>
                          <TableCell>{a.hospitalName || "—"}</TableCell>
                          <TableCell>{a.date || "—"}</TableCell>
                          <TableCell>{a.preferredTime || "—"}</TableCell>
                          <TableCell>
                            <StatusChip status={a.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </>
        )}

        {/* Hospitals */}
        {tab === "hospitals" && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(25,118,210,0.1)",
              boxShadow: "0 2px 16px rgba(25,118,210,0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#0d2a2a">
                Hospitals ({hospitals.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openModal("addHospital")}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})`,
                }}
              >
                Add Hospital
              </Button>
            </Box>
            <TextField
              fullWidth
              placeholder="Search hospitals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      "Name",
                      "Location",
                      "Specialties",
                      "Contact",
                      "Actions",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          fontSize: 12,
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hospitals
                    .filter((h) =>
                      h.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((h) => (
                      <TableRow key={h.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{h.name}</TableCell>
                        <TableCell>{h.location}</TableCell>
                        <TableCell>
                          {(h.specialties || []).join(", ") || "—"}
                        </TableCell>
                        <TableCell>{h.contact || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => openModal("editHospital", h)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete("hospital", h.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Doctors */}
        {tab === "doctors" && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(25,118,210,0.1)",
              boxShadow: "0 2px 16px rgba(25,118,210,0.06)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#0d2a2a">
                Doctors ({allDoctors.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openModal("addDoctor")}
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})`,
                }}
              >
                Add Doctor
              </Button>
            </Box>
            <TextField
              fullWidth
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      "Name",
                      "Specialty",
                      "Hospital",
                      "Experience",
                      "Actions",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          fontSize: 12,
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDoctors
                    .filter((d) =>
                      d.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((d) => {
                      const isAdminAdded = adminDoctors.some(
                        (ad) => ad.id === d.id,
                      );
                      return (
                        <TableRow key={d.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {d.name}
                          </TableCell>
                          <TableCell>{d.specialty}</TableCell>
                          <TableCell>{d.hospitalName || "—"}</TableCell>
                          <TableCell>{d.experience || "—"}</TableCell>
                          <TableCell>
                            {isAdminAdded ? (
                              <>
                                <IconButton
                                  color="primary"
                                  onClick={() => openModal("editDoctor", d)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete("doctor", d.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            ) : (
                              <Chip
                                label="Built-in"
                                size="small"
                                sx={{
                                  bgcolor: PRIMARY_LIGHT,
                                  color: PRIMARY,
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Appointments */}
        {tab === "appointments" && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(25,118,210,0.1)",
              boxShadow: "0 2px 16px rgba(25,118,210,0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#0d2a2a" mb={3}>
              All Appointments ({appointments.length})
            </Typography>
            {appointments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography fontSize={56}>📭</Typography>
                <Typography color="text.secondary" mt={1}>
                  No appointments yet
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        "Patient",
                        "Doctor",
                        "Hospital",
                        "Date",
                        "Time",
                        "Payment",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontWeight: 700,
                            color: "text.secondary",
                            fontSize: 12,
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {a.patientName || "—"}
                        </TableCell>
                        <TableCell>{a.doctorName || "—"}</TableCell>
                        <TableCell>{a.hospitalName || "—"}</TableCell>
                        <TableCell>{a.date || "—"}</TableCell>
                        <TableCell>{a.preferredTime || "—"}</TableCell>
                        <TableCell>{a.paymentMethod || "—"}</TableCell>
                        <TableCell>
                          <StatusChip status={a.status} />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color={
                              a.status === "Scheduled" ? "success" : "warning"
                            }
                            sx={{ mr: 1, borderRadius: 2 }}
                            onClick={() =>
                              setAppointments(
                                appointments.map((x) =>
                                  x.id === a.id
                                    ? {
                                        ...x,
                                        status:
                                          x.status === "Scheduled"
                                            ? "Completed"
                                            : "Scheduled",
                                      }
                                    : x,
                                ),
                              )
                            }
                          >
                            {a.status === "Scheduled" ? "Complete" : "Reopen"}
                          </Button>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete("appointment", a.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}
      </Box>

      {/* Modal */}
      <Dialog
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            px: 3,
            py: 2.5,
          }}
        >
          <Typography variant="h6" color="white" fontWeight={700}>
            {modal.type.includes("add") ? "Add" : "Edit"}{" "}
            {modal.type.includes("Hospital") ? "Hospital" : "Doctor"}
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={fieldSx}
          />
          {modal.type.includes("Hospital") && (
            <>
              <TextField
                fullWidth
                label="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Specialties (comma separated)"
                value={form.specialties}
                onChange={(e) =>
                  setForm({ ...form, specialties: e.target.value })
                }
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Contact Number"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                sx={fieldSx}
              />
            </>
          )}
          {modal.type.includes("Doctor") && (
            <>
              <TextField
                fullWidth
                label="Specialty"
                value={form.specialty}
                onChange={(e) =>
                  setForm({ ...form, specialty: e.target.value })
                }
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Experience"
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Qualification"
                value={form.qualification}
                onChange={(e) =>
                  setForm({ ...form, qualification: e.target.value })
                }
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Availability"
                value={form.availability}
                onChange={(e) =>
                  setForm({ ...form, availability: e.target.value })
                }
                sx={fieldSx}
              />
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Hospital *</InputLabel>
                <Select
                  value={form.hospitalId || ""}
                  label="Hospital *"
                  onChange={(e) =>
                    setForm({ ...form, hospitalId: e.target.value })
                  }
                >
                  {hospitals.map((h) => (
                    <MenuItem key={h.id} value={h.id}>
                      {h.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setModal({ ...modal, open: false })}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
