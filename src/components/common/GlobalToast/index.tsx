import { useEffect, useState } from "react";
import Toast from "../Toast";
import { useStore } from "../../../store";
import { observer } from "mobx-react-lite";

function GlobalToast() {
  const store = useStore();
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    setSuccessOpen(Boolean(store.globalToastStore.successMessage));
  }, [store.globalToastStore.successMessage]);

  useEffect(() => {
    setErrorOpen(Boolean(store.globalToastStore.errorMessage));
  }, [store.globalToastStore.errorMessage]);

  const handleSuncessClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const handleErrorClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };
  return (
    <>
      <Toast
        open={successOpen}
        color="success"
        message={store.globalToastStore.successMessage}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleSuncessClose}
      />
      <Toast
        open={errorOpen}
        color="error"
        message={store.globalToastStore.errorMessage}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrorClose}
      />
    </>
  );
}

export default observer(GlobalToast);
