// src/components/BookingConfirmation.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";

// Consistent blue used throughout the app
const PRIMARY = "#1976d2";
const PRIMARY_DARK = "#1565c0";
const PRIMARY_LIGHT = "#e3f2fd";

const Row = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      py: 1.5,
      borderBottom: "1px solid #f0f0f0",
      "&:last-child": { borderBottom: "none" },
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: PRIMARY_LIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 18, color: PRIMARY } })}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

export default function BookingConfirmation({ open, onClose, booking }) {
  if (!booking) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
          py: 4,
          px: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.15)",
            mx: "auto",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 44, color: "white" }} />
        </Box>
        <Typography variant="h6" color="white" fontWeight={700} gutterBottom>
          Booking Confirmed!
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            px: 2,
            py: 0.5,
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 20,
          }}
        >
          <Typography
            variant="caption"
            color="white"
            fontWeight={600}
            letterSpacing={1}
          >
            REF #{String(booking.id).slice(-6).toUpperCase()}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Screenshot this for your records. Your appointment is scheduled.
        </Typography>
        <Divider sx={{ mb: 1.5 }} />

        <Row
          icon={<PersonIcon />}
          label="Patient"
          value={booking.patientName}
        />
        <Row
          icon={<LocalHospitalIcon />}
          label="Doctor"
          value={`${booking.doctorName} · ${booking.hospitalName}`}
        />
        <Row icon={<CalendarMonthIcon />} label="Date" value={booking.date} />
        <Row
          icon={<AccessTimeIcon />}
          label="Appointment"
          value={booking.preferredTime}
        />
        <Row
          icon={<PaymentIcon />}
          label="Amount Paid"
          value={`NPR ${booking.amount} via ${booking.paymentMethod}`}
        />

        {/* Status badge */}
        <Box
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: PRIMARY_LIGHT,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" fontWeight={700} color={PRIMARY}>
            Status: Scheduled ✓
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onClose}
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontWeight: 700,
            fontSize: "1rem",
            background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            boxShadow: "0 4px 16px rgba(25,118,210,0.3)",
            "&:hover": {
              background: `linear-gradient(90deg, #0d47a1, ${PRIMARY_DARK})`,
            },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
