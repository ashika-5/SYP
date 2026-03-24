import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // eSewa sends back base64 encoded data in URL
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");

    if (data) {
      try {
        const decoded = JSON.parse(atob(data));
        console.log("eSewa payment response:", decoded);

        // Get the pending booking saved before redirect
        const pending = JSON.parse(
          localStorage.getItem("pendingBooking") || "{}",
        );

        if (pending.doctorId) {
          const existing = JSON.parse(
            localStorage.getItem("appointments") || "[]",
          );
          const newAppt = {
            ...pending,
            id: Date.now(),
            status: "Scheduled",
            date: new Date().toLocaleDateString(),
            paymentMethod: "eSewa",
            transactionId: decoded.transaction_uuid,
          };
          localStorage.setItem(
            "appointments",
            JSON.stringify([...existing, newAppt]),
          );
          localStorage.removeItem("pendingBooking");
        }
      } catch (e) {
        console.error("Error parsing eSewa response", e);
      }
    }

    setVerified(true);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      {!verified ? (
        <CircularProgress />
      ) : (
        <Paper elevation={4} sx={{ p: 6, borderRadius: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 90, color: "#2e7d32" }} />
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
            Payment Successful!
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, fontSize: "1.1rem" }}>
            Your appointment has been booked successfully via eSewa.
          </Typography>
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "#e8f5e9",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              You can view your appointment in the Admin Dashboard.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ mt: 4, px: 6, borderRadius: 3 }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Paper>
      )}
    </Container>
  );
}
