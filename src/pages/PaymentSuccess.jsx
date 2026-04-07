// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [booking, setBooking] = useState(null);
  const [txId, setTxId] = useState("");

  useEffect(() => {
    // eSewa returns a base64-encoded JSON in ?data= query param
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    let decodedTx = "";

    if (data) {
      try {
        const decoded = JSON.parse(atob(data));
        console.log("eSewa payment response:", decoded);
        decodedTx = decoded.transaction_uuid || decoded.refId || "";
        setTxId(decodedTx);
      } catch (e) {
        console.error("Error decoding eSewa response:", e);
      }
    }

    // Restore pending booking that was saved before the redirect
    try {
      const pending = JSON.parse(
        localStorage.getItem("pendingBooking") || "{}",
      );

      if (pending.doctorId) {
        const newAppt = {
          ...pending,
          id: Date.now(),
          status: "Scheduled",
          date: new Date().toLocaleDateString(),
          paymentMethod: "eSewa",
          transactionId: decodedTx || pending.transactionId || "",
        };

        const existing = JSON.parse(
          localStorage.getItem("appointments") || "[]",
        );
        localStorage.setItem(
          "appointments",
          JSON.stringify([...existing, newAppt]),
        );
        localStorage.removeItem("pendingBooking");
        setBooking(newAppt);
      }
    } catch (e) {
      console.error("Error saving appointment:", e);
    }

    setVerified(true);
  }, []);

  if (!verified) {
    return (
      <Container maxWidth="sm" sx={{ py: 16, textAlign: "center" }}>
        <CircularProgress size={56} thickness={4} />
        <Typography color="text.secondary" mt={3}>
          Verifying your payment…
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Green header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #14532d, #16a34a)",
            py: 5,
            px: 4,
            color: "white",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h5" fontWeight={800}>
            Payment Successful!
          </Typography>
          <Typography sx={{ opacity: 0.85, mt: 0.5, fontSize: 15 }}>
            Your appointment has been confirmed
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ p: 4 }}>
          {/* eSewa badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              bgcolor: "#f0fff4",
              border: "1px solid #86efac",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: "#60BD4F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ color: "white", fontSize: 13, fontWeight: 900 }}
              >
                e
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 13, fontWeight: 700, color: "#14532d" }}
            >
              Paid via eSewa
            </Typography>
          </Box>

          {/* Booking details */}
          {booking && (
            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: 3,
                p: 3,
                mb: 3,
                textAlign: "left",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography fontWeight={800} fontSize={16} color="#0f172a" mb={2}>
                Booking Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {[
                { label: "Doctor", value: booking.doctorName },
                { label: "Specialty", value: booking.specialty },
                { label: "Hospital", value: booking.hospitalName },
                { label: "Patient", value: booking.patientName },
                { label: "Date", value: booking.date },
                { label: "Time Slot", value: booking.preferredTime },
                { label: "Amount Paid", value: `NPR ${booking.amount}` },
                ...(txId ? [{ label: "Transaction ID", value: txId }] : []),
              ].map((row) => (
                <Box
                  key={row.label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {row.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#0f172a">
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box
            sx={{
              p: 2,
              bgcolor: "#eff6ff",
              borderRadius: 2,
              border: "1px solid #bfdbfe",
              mb: 3,
            }}
          >
            <Typography variant="body2" color="#1e40af">
              ✅ Your appointment is confirmed. Please arrive 15 minutes early
              with a valid ID.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<DashboardIcon />}
              onClick={() => navigate("/patient/dashboard")}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                py: 1.5,
                bgcolor: "#16a34a",
                "&:hover": { bgcolor: "#15803d" },
              }}
            >
              View My Appointments
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                py: 1.5,
                borderColor: "#d1d5db",
                color: "#6b7280",
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
