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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Status chip helper
const getStatusChip = (status) => {
  const colors = {
    Scheduled: "warning",
    Completed: "success",
    Cancelled: "error",
  };
  return (
    <Chip
      label={status || "Scheduled"}
      color={colors[status] || "default"}
      size="small"
      sx={{ fontWeight: "medium" }}
    />
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState("dashboard");

  // Load data from localStorage
  const [hospitals, setHospitals] = useState(() => {
    const saved = localStorage.getItem("hospitals");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "City Care Hospital", location: "Kathmandu" },
          { id: 2, name: "Green Valley Medical Center", location: "Pokhara" },
          { id: 3, name: "Sunrise Hospital", location: "Lalitpur" },
        ];
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem("doctors");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 101, name: "Dr. Aashish Das", specialty: "Cardiology" },
          { id: 102, name: "Dr. Neha Sharma", specialty: "Neurology" },
          { id: 103, name: "Dr. Suman Thapa", specialty: "Orthopedics" },
        ];
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("hospitals", JSON.stringify(hospitals));
    localStorage.setItem("doctors", JSON.stringify(doctors));
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [hospitals, doctors, appointments]);

  // Modal for add/edit
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); // addHospital, editHospital, addDoctor, editDoctor
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    specialty: "",
  });

  const openModalHandler = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setFormData({
      name: item ? item.name : "",
      location: item?.location || "",
      specialty: item?.specialty || "",
    });
    setOpenModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return alert("Name is required");

    if (modalType === "addHospital") {
      setHospitals([
        ...hospitals,
        { id: Date.now(), name: formData.name, location: formData.location },
      ]);
    } else if (modalType === "editHospital") {
      setHospitals(
        hospitals.map((h) =>
          h.id === currentItem.id ? { ...h, ...formData } : h,
        ),
      );
    } else if (modalType === "addDoctor") {
      setDoctors([
        ...doctors,
        { id: Date.now(), name: formData.name, specialty: formData.specialty },
      ]);
    } else if (modalType === "editDoctor") {
      setDoctors(
        doctors.map((d) =>
          d.id === currentItem.id ? { ...d, ...formData } : d,
        ),
      );
    }

    setOpenModal(false);
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Delete this ${type}?`)) {
      if (type === "hospital")
        setHospitals(hospitals.filter((h) => h.id !== id));
      if (type === "doctor") setDoctors(doctors.filter((d) => d.id !== id));
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Sidebar - taller and more spaced */}
      <Box sx={{ width: 300, bgcolor: "#1a3c5e", color: "white", p: 4 }}>
        <Typography
          variant="h4"
          sx={{ mb: 6, fontWeight: "bold", textAlign: "center" }}
        >
          Admin Dashboard
        </Typography>

        <List>
          {[
            { label: "Dashboard", value: "dashboard", icon: <DashboardIcon /> },
            {
              label: "Hospitals",
              value: "hospitals",
              icon: <LocalHospitalIcon />,
            },
            { label: "Doctors", value: "doctors", icon: <PersonIcon /> },
            {
              label: "Appointments",
              value: "appointments",
              icon: <CalendarMonthIcon />,
            },
          ].map((item) => (
            <ListItem
              button
              key={item.value}
              sx={{
                bgcolor: activeTab === item.value ? "#2c5282" : "transparent",
                borderRadius: 2,
                mb: 2,
                py: 2,
                px: 3,
                transition: "all 0.3s",
                "&:hover": { bgcolor: "#2c5282" },
              }}
              onClick={() => setActiveTab(item.value)}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 50, fontSize: 30 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "1.2rem" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 4, md: 6 }, pb: 12 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mb: 6 }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Typography>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={6}
                sx={{ bgcolor: "#e3f2fd", height: "100%", borderRadius: 3 }}
              >
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h2" color="primary" fontWeight="bold">
                    {hospitals.length}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Total Hospitals
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={6}
                sx={{ bgcolor: "#e8f5e9", height: "100%", borderRadius: 3 }}
              >
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    variant="h2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {doctors.length}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Total Doctors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                elevation={6}
                sx={{ bgcolor: "#fff3e0", height: "100%", borderRadius: 3 }}
              >
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    variant="h2"
                    color="warning.main"
                    fontWeight="bold"
                  >
                    {appointments.length}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Total Appointments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Hospitals */}
        {activeTab === "hospitals" && (
          <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 5,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Manage Hospitals
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                onClick={() => openModalHandler("addHospital")}
              >
                Add Hospital
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Location</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hospitals.map((h) => (
                    <TableRow key={h.id} hover>
                      <TableCell sx={{ py: 3 }}>{h.name}</TableCell>
                      <TableCell sx={{ py: 3 }}>{h.location}</TableCell>
                      <TableCell align="right" sx={{ py: 3 }}>
                        <IconButton
                          color="primary"
                          onClick={() => openModalHandler("editHospital", h)}
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
        {activeTab === "doctors" && (
          <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 5,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Manage Doctors
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                onClick={() => openModalHandler("addDoctor")}
              >
                Add Doctor
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Specialty</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.map((d) => (
                    <TableRow key={d.id} hover>
                      <TableCell sx={{ py: 3 }}>{d.name}</TableCell>
                      <TableCell sx={{ py: 3 }}>{d.specialty}</TableCell>
                      <TableCell align="right" sx={{ py: 3 }}>
                        <IconButton
                          color="primary"
                          onClick={() => openModalHandler("editDoctor", d)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete("doctor", d.id)}
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

        {/* Appointments */}
        {activeTab === "appointments" && (
          <Paper elevation={4} sx={{ p: 5, borderRadius: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 4 }}
            >
              Recent Appointments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Patient Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Doctor</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Hospital</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Preferred Time</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length > 0 ? (
                    appointments.map((appt, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ py: 3 }}>
                          {appt.patientName || "—"}
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          {appt.doctorName || "—"}
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          {appt.hospitalName || "—"}
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>
                          <strong>{appt.preferredTime || "—"}</strong>
                        </TableCell>
                        <TableCell sx={{ py: 3 }}>{appt.date || "—"}</TableCell>
                        <TableCell sx={{ py: 3 }}>
                          {getStatusChip(appt.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography
                          color="text.secondary"
                          sx={{ py: 10, fontSize: "1.2rem" }}
                        >
                          No appointments booked yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Add/Edit Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {modalType.includes("add") ? "Add" : "Edit"}{" "}
          {modalType.includes("Hospital") ? "Hospital" : "Doctor"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 3 }}
          />
          {modalType.includes("Hospital") && (
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              sx={{ mt: 3 }}
            />
          )}
          {modalType.includes("Doctor") && (
            <TextField
              fullWidth
              label="Specialty"
              value={formData.specialty}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
              sx={{ mt: 3 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
