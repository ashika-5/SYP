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
import { doctors as STATIC_DOCTORS } from "../data/doctors";
import { hospitals as STATIC_HOSPITALS } from "../data/hospitals";

export default function DoctorsList() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const id = Number(hospitalId);

  // Merge static + admin-added hospitals to get the correct name
  const allHospitals = [
    ...STATIC_HOSPITALS,
    ...JSON.parse(localStorage.getItem("hospitals") || "[]"),
  ];
  const hospital = allHospitals.find((h) => h.id === id);
  const hospitalName = hospital?.name || "Unknown Hospital";

  // Merge static + admin-added doctors, then filter by hospital
  const allDoctors = [
    ...STATIC_DOCTORS,
    ...JSON.parse(localStorage.getItem("doctors") || "[]"),
  ];
  const hospitalDoctors = allDoctors.filter((d) => d.hospitalId === id);

  if (hospitalDoctors.length === 0) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No doctors available for {hospitalName} yet.
        </Typography>
        <Button
          variant="contained"
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
        fontWeight="bold"
        color="primary"
        sx={{ mb: 6 }}
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
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
                },
              }}
            >
              {doctor.image ? (
                <CardMedia
                  component="img"
                  height="240"
                  image={doctor.image}
                  alt={doctor.name}
                  sx={{ objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    height: 240,
                    bgcolor: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography fontSize="5rem">👨‍⚕️</Typography>
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {doctor.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {doctor.specialty}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  <strong>Experience:</strong> {doctor.experience || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Availability:</strong> {doctor.availability || "N/A"}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/doctor/${doctor.id}`)}
                >
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button variant="outlined" size="large" onClick={() => navigate("/")}>
          Back to Hospitals
        </Button>
      </Box>
    </Container>
  );
}
