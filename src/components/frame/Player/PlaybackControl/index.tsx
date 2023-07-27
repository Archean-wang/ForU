import {
  faBackwardStep,
  faCirclePause,
  faCirclePlay,
  faForwardStep,
  faRepeat,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";

import Progress from "../Progress";

import {
  useSpotifyDevice,
  useSpotifyPlayer,
  useSpotifyState,
} from "spotify-web-playback-sdk-for-react";
import { setRepeatMode, setShuffleMode } from "../../../../api";

function PlaybackControl() {
  const playbackState = useSpotifyState();
  const player = useSpotifyPlayer();
  const device = useSpotifyDevice();

  function shuffle() {
    let mode = !playbackState?.shuffle;
    setShuffleMode(mode, device?.device_id).then((res) => {
      console.log(`set shuffle: ${mode}`);
    });
  }

  const modes = ["off", "context", "track"];
  function repeat() {
    if (playbackState?.shuffle === undefined) return;
    let mode = (playbackState?.repeat_mode + 1) % 3;
    setRepeatMode(modes[mode], device?.device_id).then((res) => {
      console.log(`set repeat mode: ${mode}`);
    });
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        gap: 1,
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          fontSize: 20,
          position: "relative",
        }}>
        <FontAwesomeIcon
          opacity={playbackState?.shuffle ? 1 : 0.4}
          onClick={shuffle}
          icon={faShuffle}
          cursor="pointer"
        />

        <FontAwesomeIcon
          onClick={() => player?.previousTrack()}
          icon={faBackwardStep}
          cursor="pointer"
        />

        <FontAwesomeIcon
          onClick={() => player?.togglePlay()}
          icon={
            playbackState === null || playbackState.paused
              ? faCirclePlay
              : faCirclePause
          }
          cursor="pointer"
        />

        <FontAwesomeIcon
          onClick={() => player?.nextTrack()}
          icon={faForwardStep}
          cursor="pointer"
        />

        <Box
          sx={{
            position: "relative",
            "&::after": {
              content: '"1"',
              fontSize: "1px",
              fontWeight: "bold",
              display: playbackState?.repeat_mode === 2 ? "inherit" : "none",
              position: "absolute",
              right: -5,
              top: -6,
            },
          }}>
          <FontAwesomeIcon
            onClick={repeat}
            icon={faRepeat}
            cursor="pointer"
            opacity={playbackState?.repeat_mode === 0 ? 0.4 : 1}
          />
        </Box>
      </Box>
      <Progress></Progress>
    </Box>
  );
}

export default PlaybackControl;
