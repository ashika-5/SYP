// src/components/PaymentDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LockIcon from "@mui/icons-material/Lock";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const PRIMARY = "#1976d2";
const PRIMARY_DARK = "#1565c0";
const PRIMARY_LIGHT = "#e3f2fd";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2.5 }}>{children}</Box> : null;
}

// Shared styled TextField
const Field = ({ label, ...props }) => (
  <TextField
    fullWidth
    required
    label={label}
    size="small"
    sx={{
      mb: 2,
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        "&.Mui-focused fieldset": { borderColor: PRIMARY },
      },
      "& label.Mui-focused": { color: PRIMARY },
    }}
    {...props}
  />
);

export default function PaymentDialog({
  open,
  onClose,
  onSuccess,
  amount = 500,
  doctorName,
}) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [wallet, setWallet] = useState("");

  const methods = ["Card", "eSewa", "Khalti"];

  const fmtCardNum = (v) =>
    v
      .replace(/\D/g, "")
      .substring(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const validate = () => {
    if (tab === 0) {
      if (card.number.replace(/\s/g, "").length < 16)
        return "Enter a valid 16-digit card number.";
      if (!card.name.trim()) return "Enter the cardholder name.";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry))
        return "Expiry must be MM/YY (e.g. 08/27).";
      if (card.cvv.length < 3) return "Enter a valid 3–4 digit CVV.";
    } else {
      if (!wallet.trim()) return `Enter your ${methods[tab]} mobile number.`;
    }
    return "";
  };

  const handlePay = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onSuccess(methods[tab]);
      setCard({ number: "", name: "", expiry: "", cvv: "" });
      setWallet("");
      setTab(0);
    }, 1800);
  };

  const handleClose = () => {
    if (loading) return;
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <LockIcon sx={{ color: "white", fontSize: 22 }} />
        <Box>
          <Typography variant="subtitle1" color="white" fontWeight={700}>
            Secure Payment
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Your payment is encrypted and secure
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5 }}>
        {/* Booking summary */}
        <Box
          sx={{
            bgcolor: PRIMARY_LIGHT,
            borderRadius: 2.5,
            p: 2,
            mb: 2.5,
            border: `1px solid rgba(25,118,210,0.15)`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocalHospitalIcon sx={{ fontSize: 16, color: PRIMARY }} />
            <Typography variant="caption" color={PRIMARY} fontWeight={600}>
              APPOINTMENT SUMMARY
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={600}>
            {doctorName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              pt: 1,
              borderTop: "1px solid rgba(25,118,210,0.15)",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Consultation fee
            </Typography>
            <Typography variant="body2" fontWeight={700} color={PRIMARY}>
              NPR {amount}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Payment method tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setError("");
          }}
          variant="fullWidth"
          sx={{
            mb: 0.5,
            "& .MuiTab-root": {
              fontSize: "0.8rem",
              fontWeight: 600,
              minHeight: 44,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: PRIMARY,
              height: 3,
              borderRadius: 2,
            },
            "& .Mui-selected": { color: `${PRIMARY} !important` },
            border: "1px solid rgba(25,118,210,0.15)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Tab
            icon={<CreditCardIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Card"
          />
          <Tab
            icon={<AccountBalanceWalletIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="eSewa"
          />
          <Tab
            icon={<AccountBalanceWalletIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Khalti"
          />
        </Tabs>

        {/* Card tab */}
        <TabPanel value={tab} index={0}>
          <Field
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={card.number}
            onChange={(e) => {
              setCard({ ...card, number: fmtCardNum(e.target.value) });
              setError("");
            }}
          />
          <Field
            label="Cardholder Name"
            placeholder="John Doe"
            value={card.name}
            onChange={(e) => {
              setCard({ ...card, name: e.target.value });
              setError("");
            }}
          />
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Field
                label="Expiry (MM/YY)"
                placeholder="08/27"
                inputProps={{ maxLength: 5 }}
                value={card.expiry}
                onChange={(e) => {
                  setCard({ ...card, expiry: e.target.value });
                  setError("");
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                label="CVV"
                placeholder="•••"
                type="password"
                inputProps={{ maxLength: 4 }}
                value={card.cvv}
                onChange={(e) => {
                  setCard({ ...card, cvv: e.target.value });
                  setError("");
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: -1 }}>
            <LockIcon sx={{ fontSize: 13, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              256-bit SSL encryption
            </Typography>
          </Box>
        </TabPanel>

        {/* eSewa tab */}
        <TabPanel value={tab} index={1}>
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#e8f5e9",
                mx: "auto",
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              🟢
            </Box>
            <Typography fontWeight={700} color="#2e7d32">
              eSewa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Nepal's leading digital wallet
            </Typography>
          </Box>
          <Field
            label="eSewa Mobile Number"
            placeholder="98XXXXXXXX"
            value={wallet}
            onChange={(e) => {
              setWallet(e.target.value);
              setError("");
            }}
          />
        </TabPanel>

        {/* Khalti tab */}
        <TabPanel value={tab} index={2}>
          <Box sx={{ textAlign: "center", mb: 2.5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#f3e5f5",
                mx: "auto",
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              🟣
            </Box>
            <Typography fontWeight={700} color="#6a1b9a">
              Khalti
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fast & secure digital payments
            </Typography>
          </Box>
          <Field
            label="Khalti Mobile Number"
            placeholder="98XXXXXXXX"
            value={wallet}
            onChange={(e) => {
              setWallet(e.target.value);
              setError("");
            }}
          />
        </TabPanel>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3, pt: 0, flexDirection: "column", gap: 1 }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePay}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <LockIcon />
            )
          }
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontWeight: 700,
            fontSize: "1rem",
            background: loading
              ? undefined
              : `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})`,
            boxShadow: "0 4px 16px rgba(25,118,210,0.3)",
            "&:hover": {
              background: `linear-gradient(90deg, #0d47a1, ${PRIMARY_DARK})`,
            },
          }}
        >
          {loading ? "Processing Payment…" : `Pay NPR ${amount}`}
        </Button>
        <Button
          fullWidth
          onClick={handleClose}
          disabled={loading}
          sx={{ borderRadius: 3, color: "text.secondary" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
