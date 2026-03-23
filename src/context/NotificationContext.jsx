import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // severity: "success" | "error" | "info" | "warning"
  const notify = useCallback((message, severity = "success") => {
    setNotif({ open: true, message, severity });
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}

      <Snackbar
        open={notif.open}
        autoHideDuration={4000}
        onClose={() => setNotif((n) => ({ ...n, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notif.severity}
          variant="filled"
          onClose={() => setNotif((n) => ({ ...n, open: false }))}
          sx={{ fontSize: "1rem", minWidth: 320 }}
        >
          {notif.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

// Hook: const notify = useNotify();  →  notify("Booked!", "success")
export const useNotify = () => useContext(NotificationContext);
