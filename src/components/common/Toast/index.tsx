import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarCloseReason,
  SnackbarOrigin,
} from "@mui/material";

interface ToastProps {
  open?: boolean;
  onClose?: (
    event: Event | React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => void;
  autoHideDuration?: number;
  message?: string;
  anchorOrigin?: SnackbarOrigin;
  color?: AlertColor;
}

function Toast({
  open,
  onClose,
  autoHideDuration,
  message,
  anchorOrigin,
  color = "info",
}: ToastProps) {
  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}>
      <Alert onClose={onClose} severity={color} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
