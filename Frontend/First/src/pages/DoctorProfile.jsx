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
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import { doctors as STATIC_DOCTORS } from "../data/doctors";
import { initiateEsewaPayment } from "../utils/esewa";

const PRIMARY = "#1565c0";
const PRIMARY_DARK = "#0d47a1";
const PRIMARY_LIGHT = "#e3f2fd";
const CONSULT_FEE = 500;

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

const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  type,
  select,
  children,
}) => (
  <TextField
    fullWidth
    required
    size="small"
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    type={type}
    select={select}
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

  // Auth via localStorage — no broken context needed
  const isLoggedIn = localStorage.getItem("isPatientLoggedIn") === "true";
  const currentUser = isLoggedIn
    ? {
        fullName: localStorage.getItem("patientName") || "",
        email: localStorage.getItem("patientEmail") || "",
        id: localStorage.getItem("patientId") || "",
      }
    : null;

  const allDoctors = [
    ...STATIC_DOCTORS,
    ...JSON.parse(localStorage.getItem("doctors") || "[]"),
  ];
  const doctor = allDoctors.find((d) => d.id === Number(doctorId));

  const [openBooking, setOpenBooking] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [paidMethod, setPaidMethod] = useState("");
  const [savedTime, setSavedTime] = useState("");

  if (!doctor) {
    return (
      <Container sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h4" color="error">
          Doctor not found
        </Typography>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setFormError("");
  };

  const handleBookClick = () => {
    if (!currentUser) {
      navigate("/patient/login");
      return;
    }
    setForm((p) => ({
      ...p,
      fullName: p.fullName || currentUser.fullName,
      email: p.email || currentUser.email,
    }));
    setOpenBooking(true);
  };

  const validate = () => {
    const e = {};
    Object.keys(EMPTY_FORM).forEach((k) => {
      if (!form[k]) e[k] = "Required";
    });
    setErrors(e);
    if (Object.keys(e).length) {
      setFormError("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validate()) return;
    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    if (
      existing.some(
        (a) =>
          a.doctorId === doctor.id && a.preferredTime === form.preferredTime,
      )
    ) {
      setFormError("This time slot is already booked. Choose another.");
      return;
    }
    setOpenBooking(false);
    setOpenPayment(true);
  };

  const saveAppointment = (method, txId = "") => {
    const appt = {
      id: Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospitalName: doctor.hospitalName || "N/A",
      patientName: form.fullName,
      patientId: currentUser?.id || "",
      patientEmail: form.email,
      age: form.age,
      contactNumber: form.contactNumber,
      email: form.email,
      preferredTime: form.preferredTime,
      status: "Scheduled",
      date: new Date().toLocaleDateString(),
      amount: CONSULT_FEE,
      paymentMethod: method,
      transactionId: txId,
    };
    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    localStorage.setItem("appointments", JSON.stringify([...existing, appt]));
    return appt;
  };

  const handleCashPayment = () => {
    setSavedTime(form.preferredTime);
    saveAppointment("Cash");
    setPaidMethod("Cash");
    setOpenPayment(false);
    setOpenSuccess(true);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleEsewaPayment = () => {
    const transactionId = `MCRE-${Date.now()}`;
    // Save full booking so PaymentSuccess can restore it after eSewa redirect
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        hospitalName: doctor.hospitalName || "N/A",
        patientName: form.fullName,
        patientId: currentUser?.id || "",
        patientEmail: form.email,
        age: form.age,
        contactNumber: form.contactNumber,
        email: form.email,
        preferredTime: form.preferredTime,
        amount: CONSULT_FEE,
        transactionId,
      }),
    );
    // Redirect to eSewa — page leaves here
    initiateEsewaPayment({ amount: CONSULT_FEE, transactionId });
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
        "Dedicated physician committed to excellent patient care.",
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
        {/* Banner */}
        <Box
          sx={{
            height: 180,
            background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 60%, #42a5f5 100%)`,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: -1,
              left: 0,
              right: 0,
              height: 40,
              background: "white",
              borderRadius: "50% 50% 0 0 / 40px 40px 0 0",
            }}
          />
        </Box>

        <Box sx={{ px: { xs: 3, md: 5 }, pb: 5 }}>
          <Grid container spacing={4}>
            {/* Left col */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", mt: -9 }}>
                <Avatar
                  src={doctor.image}
                  alt={doctor.name}
                  sx={{
                    width: 160,
                    height: 160,
                    mx: "auto",
                    border: "6px solid white",
                    boxShadow: "0 10px 40px rgba(25,118,210,0.2)",
                    bgcolor: PRIMARY_LIGHT,
                    fontSize: "4rem",
                  }}
                >
                  {!doctor.image && "👨‍⚕️"}
                </Avatar>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  mt={2.5}
                  color="#0f172a"
                >
                  {doctor.name}
                </Typography>
                <Chip
                  label={doctor.specialty}
                  sx={{
                    mt: 1,
                    bgcolor: PRIMARY_LIGHT,
                    color: PRIMARY,
                    fontWeight: 700,
                  }}
                />

                {doctor.hospitalName && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      mt: 1.5,
                    }}
                  >
                    <LocalHospitalIcon
                      sx={{ color: "text.secondary", fontSize: 18 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {doctor.hospitalName}
                    </Typography>
                  </Box>
                )}

                {/* Fee + Book */}
                <Paper
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    border: `1.5px solid rgba(25,118,210,0.18)`,
                    background: "linear-gradient(135deg, #f0f7ff, #e8f4fd)",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    letterSpacing={1}
                    textTransform="uppercase"
                    fontWeight={600}
                  >
                    Consultation Fee
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    color={PRIMARY}
                    mt={0.5}
                    sx={{ fontFamily: "'Georgia', serif" }}
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
                      py: 1.7,
                      borderRadius: 3,
                      fontWeight: 800,
                      fontSize: 15,
                      textTransform: "none",
                      background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`,
                      boxShadow: "0 6px 20px rgba(21,101,192,0.4)",
                      "&:hover": {
                        background: `linear-gradient(135deg, #0a2f6b, ${PRIMARY_DARK})`,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {currentUser ? "Book Appointment" : "Login to Book"}
                  </Button>

                  {!currentUser && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1.5}
                    >
                      No account?{" "}
                      <Box
                        component="span"
                        sx={{
                          color: PRIMARY,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                        onClick={() => navigate("/patient/login")}
                      >
                        Register free →
                      </Box>
                    </Typography>
                  )}
                </Paper>

                {/* eSewa badge */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: "#f0fff4",
                      border: "1px solid #86efac",
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 1,
                        bgcolor: "#60BD4F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{ color: "white", fontSize: 10, fontWeight: 900 }}
                      >
                        e
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600, color: "#166534" }}
                    >
                      eSewa Accepted
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right col */}
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
                <Divider sx={{ borderColor: "rgba(25,118,210,0.15)", mb: 3 }} />
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

      {/* ══ BOOKING DIALOG ══ */}
      <Dialog
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            px: 4,
            py: 3,
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            Book Appointment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            with {doctor.name} · {doctor.specialty}
          </Typography>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Field
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
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
              <Field
                label="Contact Number"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
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
              <Field
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
              </Field>
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: PRIMARY_LIGHT,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                fontWeight={600}
              >
                Consultation Fee
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inclusive of all charges
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={800} color={PRIMARY}>
              NPR {CONSULT_FEE}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, gap: 1 }}>
          <Button
            onClick={() => setOpenBooking(false)}
            sx={{ borderRadius: 2.5, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleProceedToPayment}
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            }}
          >
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══ PAYMENT DIALOG ══ */}
      <Dialog
        open={openPayment}
        onClose={() => {
          setOpenPayment(false);
          setOpenBooking(true);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            px: 4,
            py: 3,
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            Choose Payment Method
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Consultation with {doctor.name}
          </Typography>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          {/* Summary */}
          <Box
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2.5,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography fontWeight={700} color="#0f172a">
                {doctor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {doctor.specialty} · {form.preferredTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {form.fullName}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
              <Typography variant="h5" fontWeight={900} color={PRIMARY}>
                NPR {CONSULT_FEE}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "block",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontSize: 11,
            }}
          >
            Select Payment Method
          </Typography>

          {/* eSewa */}
          <Box
            onClick={handleEsewaPayment}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 3,
              cursor: "pointer",
              border: "2px solid #60BD4F",
              bgcolor: "#f0fff4",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(96,189,79,0.3)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2.5,
                bgcolor: "#60BD4F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(96,189,79,0.45)",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 900,
                  fontSize: 26,
                  fontFamily: "'Georgia',serif",
                }}
              >
                e
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={800} fontSize={16} color="#14532d">
                Pay with eSewa
              </Typography>
              <Typography
                variant="body2"
                color="#166534"
                sx={{ opacity: 0.85 }}
              >
                Nepal's #1 digital wallet · Instant & Secure
              </Typography>
            </Box>
            <Chip
              label="Recommended"
              size="small"
              sx={{
                bgcolor: "#dcfce7",
                color: "#14532d",
                fontWeight: 700,
                border: "1px solid #86efac",
              }}
            />
          </Box>

          {/* Cash */}
          <Box
            onClick={handleCashPayment}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
              border: "2px solid #e2e8f0",
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              transition: "all 0.2s",
              "&:hover": {
                border: `2px solid ${PRIMARY}`,
                boxShadow: "0 6px 20px rgba(21,101,192,0.12)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2.5,
                bgcolor: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1.5px solid #bfdbfe",
              }}
            >
              <CreditCardIcon sx={{ color: PRIMARY, fontSize: 28 }} />
            </Box>
            <Box>
              <Typography fontWeight={800} fontSize={16} color="#0f172a">
                Pay at Counter (Cash)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pay when you arrive at the clinic
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 2.5, textAlign: "center" }}
          >
            🔒 Payments are 100% secure. No card data stored on our servers.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button
            onClick={() => {
              setOpenPayment(false);
              setOpenBooking(true);
            }}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              color: "text.secondary",
            }}
          >
            ← Back
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══ CASH SUCCESS DIALOG ══ */}
      <Dialog
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: "hidden", textAlign: "center" },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #14532d, #16a34a)",
            px: 4,
            py: 4,
            color: "white",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 72, mb: 1 }} />
          <Typography variant="h5" fontWeight={800}>
            Appointment Booked!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
            Paid via {paidMethod}
          </Typography>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          <Box
            sx={{
              p: 2.5,
              bgcolor: "#f0fdf4",
              borderRadius: 2.5,
              border: "1px solid #bbf7d0",
              mb: 3,
            }}
          >
            <Typography fontWeight={700} color="#0f172a">
              {doctor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {doctor.specialty}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              📅 {new Date().toLocaleDateString()} at {savedTime || "—"}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setOpenSuccess(false);
              navigate("/patient/dashboard");
            }}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
            }}
          >
            View My Appointments
          </Button>
          <Button
            fullWidth
            sx={{
              mt: 1.5,
              borderRadius: 3,
              textTransform: "none",
              color: "text.secondary",
            }}
            onClick={() => {
              setOpenSuccess(false);
              navigate("/");
            }}
          >
            Back to Home
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
