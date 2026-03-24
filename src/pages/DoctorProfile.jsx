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
import { doctors as STATIC_DOCTORS } from "../data/doctors";
import PaymentDialog from "../components/PaymentDialog";
import BookingConfirmation from "../components/BookingConfirmation";
import { useNotify } from "../context/NotificationContext";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const EMPTY_FORM = {
  fullName: "",
  age: "",
  contactNumber: "",
  email: "",
  preferredTime: "",
};

const CONSULT_FEE = 500;

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const notify = useNotify();

  const allDoctors = [
    ...STATIC_DOCTORS,
    ...JSON.parse(localStorage.getItem("doctors") || "[]"),
  ];
  const doctor = allDoctors.find((d) => d.id === Number(doctorId));

  const [openBooking, setOpenBooking] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [savedBooking, setSavedBooking] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);

  if (!doctor) {
    return (
      <Container sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h4" color="error">
          Doctor not found
        </Typography>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleContactChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, contactNumber: val }));
    setErrors((prev) => ({ ...prev, contactNumber: "" }));
    setFormError("");
  };

  const handleProceedToPayment = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "This field is required";
    if (!form.age) newErrors.age = "This field is required";

    if (!form.contactNumber) {
      newErrors.contactNumber = "This field is required";
    } else if (!/^\d{10}$/.test(form.contactNumber)) {
      newErrors.contactNumber = "Contact number must be exactly 10 digits";
    }

    if (!form.email) {
      newErrors.email = "This field is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.preferredTime) newErrors.preferredTime = "This field is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setFormError("Please fix the errors below.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    if (
      existing.some(
        (a) =>
          a.doctorId === doctor.id && a.preferredTime === form.preferredTime,
      )
    ) {
      setFormError("This time slot is already booked. Please choose another.");
      return;
    }

    const booking = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalName: doctor.hospitalName || "N/A",
      patientName: form.fullName,
      age: form.age,
      contactNumber: form.contactNumber,
      email: form.email,
      preferredTime: form.preferredTime,
      amount: CONSULT_FEE,
    };
    setPendingBooking(booking);

    setOpenBooking(false);
    setOpenPayment(true);
  };

  const details = [
    { label: "Experience", value: doctor.experience || "N/A" },
    { label: "Qualification", value: doctor.qualification || "N/A" },
    { label: "Availability", value: doctor.availability || "N/A" },
    {
      label: "About",
      value: doctor.bio || "Experienced and dedicated physician.",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 10 }}>
      <Paper elevation={6} sx={{ p: { xs: 4, md: 8 }, borderRadius: 4 }}>
        <Grid container spacing={6}>
          {/* Left — photo */}
          <Grid item xs={12} md={5} sx={{ textAlign: "center" }}>
            <Avatar
              src={doctor.image}
              alt={doctor.name}
              sx={{
                width: { xs: 240, md: 380 },
                height: { xs: 240, md: 380 },
                mx: "auto",
                mb: 3,
                border: "6px solid #e3f2fd",
                boxShadow: 6,
                fontSize: "8rem",
                bgcolor: "#e3f2fd",
              }}
            >
              {!doctor.image && "👨‍⚕️"}
            </Avatar>
            <Typography variant="h4" fontWeight="bold">
              {doctor.name}
            </Typography>
            <Typography variant="h6" color="primary">
              {doctor.specialty}
            </Typography>
            {doctor.hospitalName && (
              <Typography color="text.secondary">
                {doctor.hospitalName}
              </Typography>
            )}
          </Grid>

          {/* Right — details */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h5"
              fontWeight={600}
              color="primary"
              sx={{ mb: 2 }}
            >
              Professional Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List disablePadding>
              {details.map(({ label, value }) => (
                <ListItem key={label} sx={{ py: 2 }}>
                  <ListItemText
                    primary={<Typography variant="h6">{label}</Typography>}
                    secondary={
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
                      >
                        {value}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Fee info */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "#e8f5e9",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Consultation Fee
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                NPR {CONSULT_FEE}
              </Typography>
            </Box>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                sx={{ py: 2, px: 8, fontSize: "1.2rem", borderRadius: 3 }}
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
        <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
          Book Appointment — {doctor.name}
        </DialogTitle>
        <DialogContent dividers>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
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
                value={form.age}
                onChange={handleChange}
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
                value={form.contactNumber}
                onChange={handleContactChange}
                inputProps={{ maxLength: 10, inputMode: "numeric" }}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber || "Must be exactly 10 digits"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.preferredTime}>
                <InputLabel>Preferred Time</InputLabel>
                <Select
                  name="preferredTime"
                  value={form.preferredTime}
                  label="Preferred Time"
                  onChange={handleChange}
                >
                  {TIME_SLOTS.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
                {errors.preferredTime && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5 }}
                  >
                    {errors.preferredTime}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Consultation fee: <strong>NPR {CONSULT_FEE}</strong> — payable via
              eSewa in the next step
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleProceedToPayment}
          >
            Proceed to Payment →
          </Button>
        </DialogActions>
      </Dialog>

      {/* eSewa Payment Dialog */}
      <PaymentDialog
        open={openPayment}
        onClose={() => {
          setOpenPayment(false);
          setOpenBooking(true);
        }}
        amount={CONSULT_FEE}
        doctorName={doctor.name}
        pendingBooking={pendingBooking}
      />

      {/* Booking Confirmation */}
      <BookingConfirmation
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        booking={savedBooking}
      />
    </Container>
  );
}
