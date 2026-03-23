import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function BookingConfirmation({ open, onClose, booking }) {
  if (!booking) return null;

  const rows = [
    { label: "Doctor", value: booking.doctorName },
    { label: "Hospital", value: booking.hospitalName },
    { label: "Patient", value: booking.patientName },
    { label: "Age", value: booking.age },
    { label: "Contact", value: booking.contactNumber },
    { label: "Email", value: booking.email },
    { label: "Appointment", value: booking.preferredTime },
    { label: "Date", value: booking.date },
    { label: "Amount Paid", value: `NPR ${booking.amount || 500}` },
    { label: "Payment Method", value: booking.paymentMethod || "Card" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* Green header */}
      <Box sx={{ bgcolor: "#2e7d32", py: 3, textAlign: "center" }}>
        <CheckCircleIcon sx={{ fontSize: 56, color: "white" }} />
        <Typography variant="h6" color="white" fontWeight="bold">
          Booking Confirmed!
        </Typography>
        <Chip
          label={`Ref: #${booking.id?.toString().slice(-6)}`}
          sx={{
            mt: 1,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          A confirmation has been saved. Please screenshot this for your
          records.
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {rows.map(({ label, value }) => (
          <Box
            key={label}
            sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}
          >
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {value || "—"}
            </Typography>
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
          onClick={onClose}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
