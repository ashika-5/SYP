import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      <Paper elevation={4} sx={{ p: 6, borderRadius: 4 }}>
        <CancelIcon sx={{ fontSize: 90, color: "#c62828" }} />
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
          Payment Failed
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, fontSize: "1.1rem" }}>
          Something went wrong with your eSewa payment. Please try again.
        </Typography>
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "#ffebee",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Your appointment was NOT booked. No money was deducted.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          size="large"
          sx={{ mt: 4, px: 6, borderRadius: 3 }}
          onClick={() => navigate(-1)}
        >
          Try Again
        </Button>
      </Paper>
    </Container>
  );
}
