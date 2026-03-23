import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const HospitalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");

  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const defaultHospitals = [
      {
        id: 1,
        name: "Dharan Health Clinic",
        location: "Dharan",
        specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
        contact: "01-6678899",
      },
      {
        id: 2,
        name: "Carewell Medical Hospital",
        location: "Itahari",
        specialties: ["Gynecology", "Oncology", "General Surgery"],
        contact: "01-7894567",
      },
      {
        id: 3,
        name: "City Care Hospital",
        location: "Kathmandu",
        specialties: ["Cardiology", "Neurology", "Pediatrics"],
        contact: "01-5551234",
      },
      {
        id: 4,
        name: "Green Valley Medical Center",
        location: "Pokhara",
        specialties: ["Orthopedics", "Dermatology", "ENT"],
        contact: "061-456789",
      },
      {
        id: 5,
        name: "Sunrise Hospital",
        location: "Lalitpur",
        specialties: ["Gynecology", "Oncology", "General Surgery"],
        contact: "01-7894567",
      },
      {
        id: 6,
        name: "Himalayan Health Clinic",
        location: "Bhaktapur",
        specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
        contact: "01-6678899",
      },
      {
        id: 7,
        name: "Global Health Clinic",
        location: "Bhaktapur",
        specialties: ["Orthopedics", "Dermatology", "ENT"],
        contact: "01-6678899",
      },
      {
        id: 8,
        name: "Noble Health Clinic",
        location: "Pokhara",
        specialties: ["Internal Medicine", "Urology", "Physiotherapy"],
        contact: "01-6678899",
      },
      {
        id: 9,
        name: "Trusted Hand Hospital",
        location: "Dharan",
        specialties: ["Gynecology", "Oncology", "General Surgery"],
        contact: "01-7894567",
      },
    ];

    const savedHospitals = JSON.parse(localStorage.getItem("hospitals")) || [];

    const merged = [
      ...defaultHospitals,
      ...savedHospitals.map((saved) => ({
        ...saved,
        specialties: saved.specialties || [],
        contact: saved.contact || "N/A",
      })),
    ];

    setHospitals(merged);
  }, []);

  const navigate = useNavigate();

  const locations = ["All", ...new Set(hospitals.map((h) => h.location))];
  const specialties = [
    "All",
    ...new Set(hospitals.flatMap((h) => h.specialties || [])),
  ];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationFilter === "All" || hospital.location === locationFilter;
    const matchesSpecialty =
      specialtyFilter === "All" ||
      (hospital.specialties && hospital.specialties.includes(specialtyFilter));
    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Available Hospitals
      </Typography>

      <Box sx={{ mb: 4, textAlign: "right" }}>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to="/admin/dashboard"
        >
          Go to Admin Dashboard
        </Button>
      </Box>

      <Box
        sx={{
          mb: 5,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search hospital name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={locationFilter}
            label="Location"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Specialty</InputLabel>
          <Select
            value={specialtyFilter}
            label="Specialty"
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            {specialties.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" size="large" startIcon={<SearchIcon />}>
          Search
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredHospitals.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              No hospitals found matching your criteria.
            </Typography>
          </Grid>
        ) : (
          filteredHospitals.map((hospital) => (
            <Grid item xs={12} sm={6} md={4} key={hospital.id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {hospital.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {hospital.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Specialties:</strong>{" "}
                    {(hospital.specialties || []).join(", ")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Contact:</strong> {hospital.contact || "N/A"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/hospital/${hospital.id}/doctors`)}
                  >
                    VIEW DOCTORS
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default HospitalListing;
