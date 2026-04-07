// src/pages/DoctorProfile.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Chip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";

import { doctors as STATIC_DOCTORS } from "../data/doctors";
import PaymentDialog from "../components/PaymentDialog";
import BookingConfirmation from "../components/BookingConfirmation";
// useNotify and useAuth replaced with localStorage-based auth (no context required)

const PRIMARY = "#1976d2";
const PRIMARY_DARK = "#1565c0";
const PRIMARY_LIGHT = "#e3f2fd";

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

const DetailRow = ({ icon, label, value }) => (
  <ListItem disableGutters sx={{ py: 1.5, alignItems: "flex-start", gap: 2 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        flexShrink: 0,
        mt: 0.5,
        bgcolor: PRIMARY_LIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 20, color: PRIMARY } })}
    </Box>
    <ListItemText
      primary={
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {label}
        </Typography>
      }
      secondary={
        <Typography variant="body1" fontWeight={500} mt={0.3}>
          {value || "N/A"}
        </Typography>
      }
    />
  </ListItem>
);

const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  type,
  children,
  select,
}) => (
  <TextField
    fullWidth
    required
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    type={type}
    select={select}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        "&.Mui-focused fieldset": { borderColor: PRIMARY },
      },
      "& label.Mui-focused": { color: PRIMARY },
    }}
  >
    {children}
  </TextField>
);

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const isPatientLoggedIn =
    localStorage.getItem("isPatientLoggedIn") === "true";
  const currentUser = isPatientLoggedIn
    ? {
        fullName: localStorage.getItem("patientName") || "",
        email: localStorage.getItem("patientEmail") || "",
      }
    : null;

  // Simple snackbar-free notify: uses console + alert fallback
  const notify = (msg, type) => {
    // If you add a toast library later, hook it here.
    // For now, non-blocking log so the app doesn't crash.
    console.log(`[${type}] ${msg}`);
  };

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

  // ==================== BOOKING LOGIC ====================
  const handleBookClick = () => {
    if (!currentUser) {
      notify("Please login or register to book an appointment", "info");
      navigate("/patient/login"); // Redirect to login/register page
      return;
    }
    setOpenBooking(true);
  };

  const handleProceedToPayment = () => {
    const newErrors = {};
    Object.keys(EMPTY_FORM).forEach((key) => {
      if (!form[key]) newErrors[key] = "This field is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError("Please fill all required fields.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    const isBooked = existing.some(
      (a) => a.doctorId === doctor.id && a.preferredTime === form.preferredTime,
    );

    if (isBooked) {
      setFormError("This time slot is already booked. Please choose another.");
      return;
    }

    setOpenBooking(false);
    setOpenPayment(true);
  };

  const handlePaymentSuccess = (paymentMethod) => {
    setOpenPayment(false);

    const newAppt = {
      id: Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalName: doctor.hospitalName || "N/A",
      patientName: form.fullName || currentUser?.fullName,
      age: form.age,
      contactNumber: form.contactNumber,
      email: form.email || currentUser?.email,
      preferredTime: form.preferredTime,
      status: "Scheduled",
      date: new Date().toLocaleDateString(),
      amount: CONSULT_FEE,
      paymentMethod,
    };

    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    localStorage.setItem(
      "appointments",
      JSON.stringify([...existing, newAppt]),
    );

    setSavedBooking(newAppt);
    notify(`Appointment booked successfully with ${doctor.name}!`, "success");
    setOpenConfirmation(true);

    setForm(EMPTY_FORM);
    setErrors({});
    setFormError("");
  };

  const details = [
    { icon: <WorkIcon />, label: "Experience", value: doctor.experience },
    {
      icon: <SchoolIcon />,
      label: "Qualification",
      value: doctor.qualification,
    },
    {
      icon: <AccessTimeIcon />,
      label: "Availability",
      value: doctor.availability,
    },
    {
      icon: <InfoIcon />,
      label: "About",
      value:
        doctor.bio ||
        "Experienced and dedicated physician committed to patient care.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Profile Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(25,118,210,0.12)",
          boxShadow: "0 4px 32px rgba(25,118,210,0.08)",
        }}
      >
        {/* Blue Banner */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 60%, #42a5f5 100%)`,
            height: 140,
          }}
        />

        <Box sx={{ px: { xs: 3, md: 6 }, pb: 6 }}>
          <Grid container spacing={5}>
            {/* Left - Avatar + Booking */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", mt: -9 }}>
                <Avatar
                  src={doctor.image}
                  alt={doctor.name}
                  sx={{
                    width: 170,
                    height: 170,
                    mx: "auto",
                    border: `6px solid white`,
                    boxShadow: "0 10px 40px rgba(25,118,210,0.25)",
                    bgcolor: PRIMARY_LIGHT,
                    fontSize: "5rem",
                  }}
                >
                  {!doctor.image && "👨‍⚕️"}
                </Avatar>

                <Typography variant="h5" fontWeight={700} mt={3}>
                  {doctor.name}
                </Typography>

                <Chip
                  label={doctor.specialty}
                  size="medium"
                  sx={{
                    mt: 1,
                    bgcolor: PRIMARY_LIGHT,
                    color: PRIMARY,
                    fontWeight: 600,
                  }}
                />

                {doctor.hospitalName && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <LocalHospitalIcon sx={{ color: "text.secondary" }} />
                    <Typography variant="body1" color="text.secondary">
                      {doctor.hospitalName}
                    </Typography>
                  </Box>
                )}

                {/* Fee & Book Button */}
                <Paper
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid rgba(25,118,210,0.2)`,
                    bgcolor: PRIMARY_LIGHT,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Consultation Fee
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color={PRIMARY}
                    mt={0.5}
                  >
                    NPR {CONSULT_FEE}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={currentUser ? <ArrowForwardIcon /> : <LoginIcon />}
                    onClick={handleBookClick}
                    sx={{
                      mt: 3,
                      py: 1.6,
                      borderRadius: 3,
                      fontWeight: 700,
                      background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})`,
                      "&:hover": {
                        background: `linear-gradient(90deg, #0d47a1, ${PRIMARY_DARK})`,
                      },
                    }}
                  >
                    {currentUser
                      ? "Book Appointment"
                      : "Login / Register to Book"}
                  </Button>
                </Paper>
              </Box>
            </Grid>

            {/* Right - Details */}
            <Grid item xs={12} md={8}>
              <Box sx={{ pt: { xs: 2, md: 6 } }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={PRIMARY}
                  gutterBottom
                >
                  Professional Details
                </Typography>
                <Divider sx={{ borderColor: "rgba(25,118,210,0.2)", mb: 3 }} />

                <List disablePadding>
                  {details.map(({ icon, label, value }) => (
                    <DetailRow
                      key={label}
                      icon={icon}
                      label={label}
                      value={value}
                    />
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Booking Form Dialog - Only shown when logged in */}
      <Dialog
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            px: 4,
            py: 3,
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Book Appointment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            with {doctor.name} • {doctor.specialty}
          </Typography>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FormField
                label="Full Name"
                name="fullName"
                value={form.fullName || currentUser?.fullName || ""}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
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
              <FormField
                label="Contact Number"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email || currentUser?.email || ""}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                label="Preferred Time Slot"
                name="preferredTime"
                value={form.preferredTime}
                onChange={handleChange}
                error={!!errors.preferredTime}
                helperText={errors.preferredTime}
                select
              >
                {TIME_SLOTS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </FormField>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: PRIMARY_LIGHT,
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Consultation Fee
            </Typography>
            <Typography variant="h6" fontWeight={700} color={PRIMARY}>
              NPR {CONSULT_FEE}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleProceedToPayment}
            endIcon={<ArrowForwardIcon />}
          >
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment & Confirmation Dialogs */}
      <PaymentDialog
        open={openPayment}
        onClose={() => {
          setOpenPayment(false);
          setOpenBooking(true);
        }}
        onSuccess={handlePaymentSuccess}
        amount={CONSULT_FEE}
        doctorName={doctor.name}
      />

      <BookingConfirmation
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        booking={savedBooking}
      />
    </Container>
  );
}
