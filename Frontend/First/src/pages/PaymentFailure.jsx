// src/pages/PaymentFailure.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #fecaca",
          boxShadow: "0 8px 40px rgba(239,68,68,0.08)",
        }}
      >
        {/* Red header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #7f1d1d, #dc2626)",
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
            <CancelIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h5" fontWeight={800}>
            Payment Failed
          </Typography>
          <Typography sx={{ opacity: 0.85, mt: 0.5, fontSize: 15 }}>
            We couldn't process your eSewa payment
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              p: 2.5,
              bgcolor: "#fff1f2",
              borderRadius: 2.5,
              border: "1px solid #fecdd3",
              mb: 3,
            }}
          >
            <Typography fontWeight={700} color="#991b1b" mb={0.5}>
              What happened?
            </Typography>
            <Typography variant="body2" color="#dc2626">
              Your payment was not completed. This can happen due to
              insufficient balance, network issues, or cancellation.
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2.5,
              bgcolor: "#f0fdf4",
              borderRadius: 2.5,
              border: "1px solid #bbf7d0",
              mb: 3,
            }}
          >
            <Typography variant="body2" color="#166534" fontWeight={600}>
              ✅ No money was deducted from your account.
            </Typography>
            <Typography variant="body2" color="#15803d" mt={0.5}>
              Your appointment was NOT booked. Please try again.
            </Typography>
          </Box>

          {/* Common reasons */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography
              variant="body2"
              fontWeight={700}
              color="#0f172a"
              mb={1.5}
            >
              Common reasons for failure:
            </Typography>
            {[
              "Insufficient eSewa wallet balance",
              "Payment session timed out",
              "Payment was cancelled",
              "Network connectivity issue",
            ].map((r) => (
              <Box
                key={r}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#dc2626",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {r}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                py: 1.5,
                bgcolor: "#dc2626",
                "&:hover": { bgcolor: "#b91c1c" },
              }}
            >
              Try Again
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
