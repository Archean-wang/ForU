import { Box } from "@mui/material";
import { useEffect } from "react";
import { transfer } from "../../../api";
import { useStore } from "../../../store";
import { observer } from "mobx-react-lite";
import CurrentPlaying from "./CurrentPlaying";

import ExtralControl from "./ExtralControl";
import { useSpotifyDevice } from "spotify-web-playback-sdk-for-react";
import PlaybackControl from "./PlaybackControl";

function Player() {
  const device = useSpotifyDevice();
  const store = useStore();

  useEffect(() => {
    if (device) {
      store.devicesStore.setDevices();
      transfer(device.device_id, false);
    }
  }, [device]);

  return (
    <Box
      sx={{
        borderTop: "solid 1px",
        borderTopColor: "divider",
        backgroundColor: "background.default",
        height: "80px",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        gap: 2,
      }}>
      <CurrentPlaying />

      <PlaybackControl />

      <ExtralControl />
    </Box>
  );
}

export default observer(Player);
