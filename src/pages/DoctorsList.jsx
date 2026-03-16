// src/pages/DoctorsList.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Divider,
} from "@mui/material";

// Import doctors and hospitals data
import { doctors } from "../data/doctors";
import { hospitals } from "../data/hospitals";

const DoctorsList = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();

  // Find the hospital by ID to get its real name
  const hospital = hospitals.find((h) => h.id === Number(hospitalId));
  const hospitalName = hospital ? hospital.name : `Hospital ID ${hospitalId}`;

  // Filter doctors for this hospital
  const hospitalDoctors = doctors.filter(
    (doc) => doc.hospitalId === Number(hospitalId),
  );

  if (hospitalDoctors.length === 0) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No doctors available for {hospitalName} yet.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate("/")}
        >
          Back to Hospitals
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          mb: 6,
        }}
      >
        Doctors at {hospitalName}
      </Typography>

      <Grid container spacing={4}>
        {hospitalDoctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <Card
              elevation={5}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="260"
                image={doctor.image}
                alt={doctor.name}
                sx={{ objectFit: "cover" }}
              />

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {doctor.name}
                </Typography>

                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {doctor.specialty}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Experience:</strong> {doctor.experience}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <strong>Availability:</strong> {doctor.availability}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => navigate(`/doctor/${doctor.id}`)}
                  sx={{ py: 1.5 }}
                >
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
        >
          Back to Hospitals
        </Button>
      </Box>
    </Container>
  );
};

export default DoctorsList;
