import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  TextField,
} from "@mui/material";
import { initiateEsewaPayment } from "../utils/esewa";

export default function PaymentDialog({
  open,
  onClose,
  amount = 500,
  doctorName,
  pendingBooking,
}) {
  const [walletId, setWalletId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = () => {
    if (!walletId.trim()) {
      setError("Please enter your eSewa ID or mobile number.");
      return;
    }
    if (!/^\d{10}$/.test(walletId)) {
      setError("eSewa ID must be a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    // Save pending booking to localStorage before redirect
    if (pendingBooking) {
      localStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));
    }

    const transactionId = `TXN-${Date.now()}`;

    // Small delay so user sees "Processing" before redirect
    setTimeout(() => {
      initiateEsewaPayment({ amount, transactionId });
    }, 800);
  };

  const handleClose = () => {
    if (loading) return;
    setError("");
    setWalletId("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Pay with eSewa</DialogTitle>

      <DialogContent>
        {/* Summary */}
        <Box sx={{ bgcolor: "#f5f5f5", borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Appointment with
          </Typography>
          <Typography fontWeight={600}>{doctorName}</Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Consultation Fee</Typography>
            <Typography fontWeight={700} color="primary">
              NPR {amount}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* eSewa branding */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
            p: 2,
            bgcolor: "#e8f5e9",
            borderRadius: 2,
          }}
        >
          <Typography variant="h3">🟢</Typography>
          <Typography fontWeight={700} color="#3d7a3d" fontSize="1.3rem">
            eSewa
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Nepal's trusted digital wallet
          </Typography>
        </Box>

        {/* eSewa ID input */}
        <TextField
          fullWidth
          required
          label="eSewa ID / Mobile Number"
          placeholder="98XXXXXXXX"
          value={walletId}
          inputProps={{ maxLength: 10, inputMode: "numeric" }}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
            setWalletId(val);
            setError("");
          }}
          helperText="Enter the 10-digit mobile number linked to your eSewa account"
        />


      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
          onClick={handlePay}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
          sx={{ py: 1.5, fontSize: "1rem" }}
        >
          {loading ? "Redirecting to eSewa…" : `Pay NPR ${amount} via eSewa`}
        </Button>
        <Button fullWidth onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
