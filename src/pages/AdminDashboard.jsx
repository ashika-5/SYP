import React, { useState, useEffect } from "react";
import { doctors as initialDoctors } from "../data/doctors";
import { hospitals as initialHospitals } from "../data/hospitals";
import { Container, Typography, Grid, Paper } from "@mui/material";

function AdminDashboard() {
  const [hospitals, setHospitals] = useState(() => {
    const saved = localStorage.getItem("hospitals");
    return saved ? JSON.parse(saved) : initialHospitals;
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem("doctors");
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  useEffect(() => {
    localStorage.setItem("hospitals", JSON.stringify(hospitals));
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }, [hospitals, doctors]);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Hospitals</Typography>

            <Typography variant="h3">{hospitals.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Doctors</Typography>

            <Typography variant="h3">{doctors.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Appointments</Typography>

            <Typography variant="h3">--</Typography>

            <Typography color="text.secondary"></Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
