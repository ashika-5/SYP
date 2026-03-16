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
  Divider,
  Grid,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";


function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}


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
  
  const [walletId, setWalletId] = useState("");

  const methods = ["Card", "eSewa", "Khalti"];

  const cardField = (key, label, placeholder, maxLen) => (
    <TextField
      fullWidth
      required
      label={label}
      placeholder={placeholder}
      value={card[key]}
      inputProps={{ maxLength: maxLen }}
      onChange={(e) => {
        setCard({ ...card, [key]: e.target.value });
        setError("");
      }}
      sx={{ mb: 2 }}
    />
  );

  const validate = () => {
    if (tab === 0) {
      if (card.number.replace(/\s/g, "").length < 16)
        return "Enter a valid 16-digit card number.";
      if (!card.name.trim()) return "Enter the cardholder name.";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return "Expiry must be MM/YY.";
      if (card.cvv.length < 3) return "Enter a valid CVV.";
    } else {
      if (!walletId.trim())
        return `Enter your ${methods[tab]} ID / mobile number.`;
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
      setWalletId("");
      setTab(0);
    }, 1800);
  };

  const handleClose = () => {
    if (loading) return; 
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Secure Payment</DialogTitle>

      <DialogContent>
        {/* Summary */}
        <Box sx={{ bgcolor: "#f5f5f5", borderRadius: 2, p: 2, mb: 2 }}>
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

        {}
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setError("");
          }}
          variant="fullWidth"
          sx={{ mb: 1 }}
        >
          <Tab icon={<CreditCardIcon />} label="Card" />
          <Tab icon={<AccountBalanceWalletIcon />} label="eSewa" />
          <Tab icon={<AccountBalanceWalletIcon />} label="Khalti" />
        </Tabs>

        {/* Card */}
        <TabPanel value={tab} index={0}>
          <TextField
            fullWidth
            required
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={card.number}
            inputProps={{ maxLength: 19 }}
            onChange={(e) => {
              
              const v = e.target.value
                .replace(/\D/g, "")
                .replace(/(.{4})/g, "$1 ")
                .trim();
              setCard({ ...card, number: v });
              setError("");
            }}
            sx={{ mb: 2 }}
          />
          {cardField("name", "Cardholder Name", "John Doe", 40)}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {cardField("expiry", "Expiry (MM/YY)", "08/27", 5)}
            </Grid>
            <Grid item xs={6}>
              {cardField("cvv", "CVV", "123", 4)}
            </Grid>
          </Grid>
        </TabPanel>

        {}
        <TabPanel value={tab} index={1}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4">🟢</Typography>
            <Typography fontWeight={600} color="#3d7a3d">
              eSewa
            </Typography>
          </Box>
          <TextField
            fullWidth
            required
            label="eSewa ID / Mobile Number"
            placeholder="98XXXXXXXX"
            value={walletId}
            onChange={(e) => {
              setWalletId(e.target.value);
              setError("");
            }}
          />
        </TabPanel>

        {}
        <TabPanel value={tab} index={2}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4">🟣</Typography>
            <Typography fontWeight={600} color="#5c2d91">
              Khalti
            </Typography>
          </Box>
          <TextField
            fullWidth
            required
            label="Khalti Mobile Number"
            placeholder="98XXXXXXXX"
            value={walletId}
            onChange={(e) => {
              setWalletId(e.target.value);
              setError("");
            }}
          />
        </TabPanel>
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
        >
          {loading ? "Processing…" : `Pay NPR ${amount}`}
        </Button>
        <Button fullWidth onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
