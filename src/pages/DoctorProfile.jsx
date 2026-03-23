import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

import { doctors } from "../data/doctors";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const doctor = doctors.find((d) => d.id === Number(doctorId));

  const [openBooking, setOpenBooking] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    contactNumber: "",
    email: "",
    preferredTime: "",
  });
  const [errors, setErrors] = useState({});
  const [bookingMessage, setBookingMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleConfirmBooking = () => {
    const newErrors = {};
    let hasError = false;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      hasError = true;
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
      hasError = true;
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
      hasError = true;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Preferred time is required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      setBookingMessage("Please fill all required fields!");
      return;
    }

    // Check for time conflict
    const existing = JSON.parse(localStorage.getItem("appointments")) || [];
    const conflict = existing.some(
      (appt) =>
        appt.doctorId === doctor.id &&
        appt.preferredTime === formData.preferredTime,
    );

    if (conflict) {
      setBookingMessage(
        "This time slot is already booked for this doctor!\nPlease choose another time.",
      );
      return;
    }

    // Save the booking
    const newAppointment = {
      id: Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalName: doctor.hospitalName || "City Care Hospital", // ← This line adds hospital name!
      patientName: formData.fullName,
      age: formData.age,
      contactNumber: formData.contactNumber,
      email: formData.email,
      preferredTime: formData.preferredTime,
      status: "Scheduled",
      date: new Date().toLocaleDateString(),
    };

    localStorage.setItem(
      "appointments",
      JSON.stringify([...existing, newAppointment]),
    );

    setBookingMessage(
      `Booking Confirmed!\n\nDoctor: ${doctor.name}\nPatient: ${formData.fullName}\nTime: ${formData.preferredTime}`,
    );

    setTimeout(() => {
      setOpenBooking(false);
      setFormData({
        fullName: "",
        age: "",
        contactNumber: "",
        email: "",
        preferredTime: "",
      });
      setErrors({});
      setBookingMessage("");
    }, 2000);
  };

  if (!doctor) {
    return (
      <Container sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h4" color="error">
          Doctor not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 10, minHeight: "100vh" }}>
      <Paper
        elevation={6}
        sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, bgcolor: "#ffffff" }}
      >
        <Grid container spacing={6}>
          {/* Left - Photo + Basic Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                src={doctor.image}
                alt={doctor.name}
                sx={{
                  width: { xs: 280, md: 400 },
                  height: { xs: 280, md: 400 },
                  mx: "auto",
                  mb: 4,
                  border: "6px solid #e3f2fd",
                  boxShadow: 6,
                }}
              />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {doctor.name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {doctor.specialty}
              </Typography>
            </Box>
          </Grid>

          {/* Right - Details + Booking */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ mb: 4, fontWeight: 600, color: "#1976d2" }}
            >
              Professional Details
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <List disablePadding>
              <ListItem sx={{ py: 2.5 }}>
                <ListItemText
                  primary={<Typography variant="h6">Experience</Typography>}
                  secondary={
                    <Typography variant="body1" sx={{ fontSize: "1.15rem" }}>
                      {doctor.experience}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ py: 2.5 }}>
                <ListItemText
                  primary={<Typography variant="h6">Qualification</Typography>}
                  secondary={
                    <Typography variant="body1" sx={{ fontSize: "1.15rem" }}>
                      {doctor.qualification}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ py: 2.5 }}>
                <ListItemText
                  primary={<Typography variant="h6">Availability</Typography>}
                  secondary={
                    <Typography variant="body1" sx={{ fontSize: "1.15rem" }}>
                      {doctor.availability}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ py: 2.5, alignItems: "flex-start" }}>
                <ListItemText
                  primary={<Typography variant="h6">About</Typography>}
                  secondary={
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "1.15rem", lineHeight: 1.8 }}
                    >
                      {doctor.bio ||
                        "Experienced and dedicated physician committed to patient care."}
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 8, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ py: 2.5, px: 8, fontSize: "1.3rem", borderRadius: 3 }}
                onClick={() => setOpenBooking(true)}
              >
                Book Appointment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Booking Dialog */}
      <Dialog
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Book Appointment with {doctor.name}
        </DialogTitle>

        <DialogContent dividers>
          {bookingMessage && (
            <Alert
              severity={
                bookingMessage.includes("Confirmed") ? "success" : "error"
              }
              sx={{ mb: 3 }}
            >
              {bookingMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                error={!!errors.age}
                helperText={errors.age}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.preferredTime}>
                <InputLabel>Preferred Time</InputLabel>
                <Select
                  name="preferredTime"
                  value={formData.preferredTime}
                  label="Preferred Time"
                  onChange={handleInputChange}
                >
                  <MenuItem value="09:00 AM">09:00 AM</MenuItem>
                  <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                  <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                  <MenuItem value="02:00 PM">02:00 PM</MenuItem>
                  <MenuItem value="03:00 PM">03:00 PM</MenuItem>
                  <MenuItem value="04:00 PM">04:00 PM</MenuItem>
                  <MenuItem value="05:00 PM">05:00 PM</MenuItem>
                </Select>
                {errors.preferredTime && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.preferredTime}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorProfile;
