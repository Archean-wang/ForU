import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { transfer } from "../../../api";
import { useStore } from "../../../store";
import { observer } from "mobx-react-lite";
import CurrentPlaying from "./CurrentPlaying";

import ExtralControl from "./ExtralControl";
import {
  useSpotifyDevice,
  useSpotifyError,
} from "spotify-web-playback-sdk-for-react";
import PlaybackControl from "./PlaybackControl";
import Toast from "../../common/Toast";

function Player() {
  const SDKError = useSpotifyError();
  const [open, setOpen] = useState(false);
  const device = useSpotifyDevice();
  const store = useStore();

  useEffect(() => {
    if (device) {
      store.devicesStore.setDevices();
      transfer(device.device_id, false);
    }
  }, [device]);

  useEffect(() => {
    setOpen(Boolean(SDKError));
  }, [SDKError]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        borderTop: "solid 1px",
        borderTopColor: "divider",
        backgroundColor: "background.default",
        height: "5rem",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        gap: 2,
      }}>
      <CurrentPlaying />

      <PlaybackControl />

      <ExtralControl />

      <Toast
        color="error"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={SDKError}
      />
    </Box>
  );
}

export default observer(Player);
