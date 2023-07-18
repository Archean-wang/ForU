import { Box } from "@mui/material";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import { useEffect } from "react";
import { transfer } from "../../api";
import { useStore } from "../../store";
import { observer } from "mobx-react-lite";
import CurrentPlaying from "../CurrentPlaying";
import PlaybackControl from "../PlaybackControl";
import ExtralControl from "../ExtralControl";

function Player() {
  const device = usePlayerDevice();
  const store = useStore();

  useEffect(() => {
    if (device?.status === "ready") {
      store.devicesStore.setDevices();
      transfer(device.device_id, false);
    } else {
      console.log(`Device status change: ${device?.status}`);
    }
  }, [device?.status]);

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
