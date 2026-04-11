// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

const NotificationContext = createContext(null);

const ICONS = {
  success: <CheckCircleIcon fontSize="small" />,
  error: <ErrorIcon fontSize="small" />,
  info: <InfoIcon fontSize="small" />,
};

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = useCallback((message, severity = "success") => {
    setNotif({ open: true, message, severity });
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <Snackbar
        open={notif.open}
        autoHideDuration={4500}
        onClose={() => setNotif((n) => ({ ...n, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notif.severity}
          variant="filled"
          icon={ICONS[notif.severity]}
          onClose={() => setNotif((n) => ({ ...n, open: false }))}
          sx={{
            fontSize: "0.95rem",
            minWidth: 340,
            borderRadius: 3,
            alignItems: "center",
            boxShadow: "0 8px 32px rgba(25,118,210,0.18)",
            // consistent blue tones for success to match app primary
            "&.MuiAlert-filledSuccess": {
              background: "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)",
            },
          }}
        >
          <Typography fontWeight={600} fontSize="0.95rem">
            {notif.message}
          </Typography>
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext);
