// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
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

import { hospitals as DEFAULT_HOSPITALS } from "../data/hospitals";
import { doctors as STATIC_DOCTORS } from "../data/doctors";
import { useAuth } from "../context/AuthContext";

const load = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const StatusChip = ({ status }) => {
  const color =
    { Scheduled: "success", Completed: "info", Cancelled: "error" }[status] ||
    "default";
  return <Chip label={status || "Scheduled"} color={color} size="small" />;
};

const THead = ({ cols }) => (
  <TableHead>
    <TableRow>
      {cols.map((c) => (
        <TableCell key={c}>
          <strong>{c}</strong>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

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

const SIDEBAR_ITEMS = [
  { label: "Dashboard", value: "dashboard", icon: <DashboardIcon /> },
  { label: "Hospitals", value: "hospitals", icon: <LocalHospitalIcon /> },
  { label: "Doctors", value: "doctors", icon: <PersonIcon /> },
  { label: "Appointments", value: "appointments", icon: <CalendarMonthIcon /> },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  // Redirect if not logged in as admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  const [tab, setTab] = useState("dashboard");
  const [adminDoctors, setAdminDoctors] = useState(() => load("doctors"));
  const [appointments, setAppointments] = useState(() => load("appointments"));

  const [hospitals, setHospitals] = useState(() => {
    const defaultIds = new Set(DEFAULT_HOSPITALS.map((h) => h.id));
    const extra = load("hospitals").filter((h) => !defaultIds.has(h.id));
    return [...DEFAULT_HOSPITALS, ...extra];
  });

  const allDoctors = [...STATIC_DOCTORS, ...adminDoctors];

  // Save to localStorage whenever data changes
  useEffect(() => {
    const defaultIds = new Set(DEFAULT_HOSPITALS.map((h) => h.id));
    localStorage.setItem(
      "hospitals",
      JSON.stringify(hospitals.filter((h) => !defaultIds.has(h.id))),
    );
    localStorage.setItem("doctors", JSON.stringify(adminDoctors));
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [hospitals, adminDoctors, appointments]);

  const [modal, setModal] = useState({ open: false, type: "", item: null });
  const [form, setForm] = useState(EMPTY_FORM);

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

  const field = (key) => ({
    fullWidth: true,
    sx: { mt: 2 },
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafd" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          bgcolor: "#0f2a4a",
          color: "white",
          p: 3,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Admin Dashboard
        </Typography>

        <List>
          {SIDEBAR_ITEMS.map(({ label, value, icon }) => (
            <ListItem
              button
              key={value}
              onClick={() => setTab(value)}
              sx={{
                bgcolor: tab === value ? "#1e4a7a" : "transparent",
                borderRadius: 2,
                mb: 1,
                "&:hover": { bgcolor: "#1e4a7a" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 3 }} />

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={logout}
          sx={{ borderColor: "white", color: "white" }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 5, overflow: "auto" }}>
        {tab === "dashboard" && (
          <>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
              Overview
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  label: "Total Hospitals",
                  value: hospitals.length,
                  color: "#1976d2",
                  icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
                },
                {
                  label: "Total Doctors",
                  value: allDoctors.length,
                  color: "#388e3c",
                  icon: <PersonIcon sx={{ fontSize: 40 }} />,
                },
                {
                  label: "Appointments",
                  value: appointments.length,
                  color: "#f57c00",
                  icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />,
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        p: 4,
                      }}
                    >
                      <Avatar
                        sx={{ bgcolor: item.color, width: 70, height: 70 }}
                      >
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h3" fontWeight="bold">
                          {item.value}
                        </Typography>
                        <Typography color="text.secondary" variant="h6">
                          {item.label}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Hospitals Tab */}
        {tab === "hospitals" && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Hospitals Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openModal("addHospital")}
              >
                Add New Hospital
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <THead
                  cols={[
                    "Name",
                    "Location",
                    "Specialties",
                    "Contact",
                    "Actions",
                  ]}
                />
                <TableBody>
                  {hospitals.map((h) => (
                    <TableRow key={h.id} hover>
                      <TableCell>{h.name}</TableCell>
                      <TableCell>{h.location}</TableCell>
                      <TableCell>
                        {(h.specialties || []).join(", ") || "—"}
                      </TableCell>
                      <TableCell>{h.contact || "N/A"}</TableCell>
                      <TableCell align="right">
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

        {/* Doctors Tab */}
        {tab === "doctors" && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Doctors ({allDoctors.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => openModal("addDoctor")}
              >
                Add New Doctor
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <THead
                  cols={[
                    "Name",
                    "Specialty",
                    "Hospital",
                    "Experience",
                    "Actions",
                  ]}
                />
                <TableBody>
                  {allDoctors.map((d) => {
                    const isAdminAdded = adminDoctors.some(
                      (ad) => ad.id === d.id,
                    );
                    return (
                      <TableRow key={d.id} hover>
                        <TableCell>{d.name}</TableCell>
                        <TableCell>{d.specialty}</TableCell>
                        <TableCell>{d.hospitalName || "—"}</TableCell>
                        <TableCell>{d.experience || "—"}</TableCell>
                        <TableCell align="right">
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Built-in
                            </Typography>
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

        {/* Appointments Tab */}
        {tab === "appointments" && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              All Appointments ({appointments.length})
            </Typography>

            <TableContainer>
              <Table>
                <THead
                  cols={[
                    "Patient",
                    "Doctor",
                    "Hospital",
                    "Time",
                    "Date",
                    "Status",
                    "Actions",
                  ]}
                />
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        No appointments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell>{a.patientName}</TableCell>
                        <TableCell>{a.doctorName}</TableCell>
                        <TableCell>{a.hospitalName}</TableCell>
                        <TableCell>
                          <strong>{a.preferredTime}</strong>
                        </TableCell>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>
                          <StatusChip status={a.status} />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
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
                            {a.status === "Scheduled"
                              ? "Mark Complete"
                              : "Reopen"}
                          </Button>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete("appointment", a.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Add/Edit Modal */}
      <Dialog
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {modal.type.includes("add") ? "Add" : "Edit"}{" "}
          {modal.type.includes("Hospital") ? "Hospital" : "Doctor"}
        </DialogTitle>
        <DialogContent>
          <TextField {...field("name")} label="Name" />

          {modal.type.includes("Hospital") && (
            <>
              <TextField {...field("location")} label="Location" />
              <TextField
                {...field("specialties")}
                label="Specialties (comma separated)"
                placeholder="Cardiology, Neurology"
              />
              <TextField {...field("contact")} label="Contact Number" />
            </>
          )}

          {modal.type.includes("Doctor") && (
            <>
              <TextField {...field("specialty")} label="Specialty" />
              <TextField
                {...field("experience")}
                label="Experience (e.g. 10 years)"
              />
              <TextField {...field("qualification")} label="Qualification" />
              <TextField {...field("availability")} label="Availability" />
              <TextField {...field("bio")} label="Bio" multiline rows={3} />
              <TextField
                {...field("image")}
                label="Image URL (optional)"
                placeholder="https://"
              />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Hospital</InputLabel>
                <Select
                  value={form.hospitalId || ""}
                  label="Hospital"
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
        <DialogActions>
          <Button onClick={() => setModal({ ...modal, open: false })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
