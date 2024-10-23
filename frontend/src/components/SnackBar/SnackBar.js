import React, { createContext, useState, useContext } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // Can be "success", "error", "warning", or "info"
    vertical: "bottom", // Default position
    horizontal: "right", // Default position
  });

  const showSnackbar = (message, severity = "info", vertical = "bottom", horizontal = "right") => {
    setSnackbar({
      open: true,
      message,
      severity,
      vertical,
      horizontal,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }} // Dynamic position
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={closeSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
