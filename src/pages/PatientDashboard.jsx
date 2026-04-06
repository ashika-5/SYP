// src/pages/PatientDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/patient/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      const saved = JSON.parse(localStorage.getItem("appointments") || "[]");
      // Show only current user's appointments
      const userAppointments = saved.filter(
        (a) =>
          a.email === currentUser.email ||
          a.patientName === currentUser.fullName,
      );
      setAppointments(
        userAppointments.sort((a, b) => new Date(b.date) - new Date(a.date)),
      );
    }
  }, [currentUser]);

  if (!currentUser) return null; // Prevent flash

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 6, bgcolor: "#f8fafd", minHeight: "100vh" }}
    >
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            bgcolor: "#1976d2",
          }}
        >
          {currentUser.fullName?.[0] || "👤"}
        </Avatar>
        <Typography variant="h4" fontWeight={700}>
          Welcome, {currentUser.fullName}!
        </Typography>
        <Typography color="text.secondary">Manage your appointments</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center", py: 5 }}>
              <Typography variant="h3" fontWeight={700} color="#1976d2">
                {appointments.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                My Appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Your Recent Appointments
          </Typography>

          {appointments.length === 0 ? (
            <Card sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
              <Typography color="text.secondary" gutterBottom>
                No appointments booked yet
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ mt: 2 }}
              >
                Browse Hospitals
              </Button>
            </Card>
          ) : (
            appointments.map((appt) => (
              <Card key={appt.id} sx={{ mb: 2.5, borderRadius: 3 }}>
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {appt.doctorName}
                      </Typography>
                      <Typography color="text.secondary">
                        <LocalHospitalIcon
                          sx={{
                            fontSize: 16,
                            verticalAlign: "middle",
                            mr: 0.5,
                          }}
                        />
                        {appt.hospitalName}
                      </Typography>
                    </Box>
                    <Chip label={appt.status} color="success" />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography fontWeight={500}>{appt.date}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography fontWeight={500}>
                        {appt.preferredTime}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
          sx={{ borderRadius: 3, px: 6 }}
        >
          Book New Appointment
        </Button>
      </Box>
    </Container>
  );
}
