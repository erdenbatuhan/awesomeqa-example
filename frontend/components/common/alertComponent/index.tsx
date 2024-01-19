import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";

import { eventBus } from "../../../common/eventBus";

type AlertOptions = {
  severity: "success" | "error" | "warning" | "info";
  message: string;
};

const AUTO_HIDE_DURATION = 10000; // In milliseconds

const AlertComponent = () => {
  const [alertShown, setAlertShown] = useState<boolean>(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    severity: "error",
    message: "An error occurred!"
  });

  const getAlertTitle = (severity: AlertOptions["severity"]): string => (
    severity.charAt(0).toUpperCase() + severity.slice(1)
  );

  // Listen to the showAlert event
  eventBus.on("showAlert", (severity: AlertOptions["severity"], message: string) => {
    setAlertShown(true);
    setAlertOptions({ severity, message });
  });

  return (
    <Snackbar
      open={alertShown}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={AUTO_HIDE_DURATION}
      onClose={() => { setAlertShown(false) }}
    >
      <Alert
        severity={alertOptions.severity}
        onClose={() => { setAlertShown(false) }}
      >
        <AlertTitle>
          {getAlertTitle(alertOptions.severity)}
        </AlertTitle>

        {alertOptions.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
