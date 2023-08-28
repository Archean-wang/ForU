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
import { useCallback, useEffect } from "react";

function PlaybackControl() {
  const playbackState = useSpotifyState();
  const player = useSpotifyPlayer();
  const device = useSpotifyDevice();

  useEffect(() => {
    window.electronAPI.onToggle(toggle);
    window.electronAPI.onNext(next);
    window.electronAPI.onPrevious(previous);
    return () => {
      window.electronAPI.removeAllListeners("tray-toggle");
      window.electronAPI.removeAllListeners("tray-next");
      window.electronAPI.removeAllListeners("tray-previous");
    };
  }, [player]);

  useEffect(() => {
    window.electronAPI.sendStatus(playbackState?.paused ?? true);
  }, [playbackState]);

  const toggle = useCallback(
    function () {
      player?.togglePlay();
    },
    [player]
  );

  const next = useCallback(
    function () {
      player?.nextTrack();
    },
    [player]
  );

  const previous = useCallback(
    function () {
      player?.previousTrack();
    },
    [player]
  );

  function shuffle() {
    if (!device) return;
    let mode = !playbackState?.shuffle;
    setShuffleMode(mode, device?.device_id).then((res) => {
      console.log(`set shuffle: ${mode}`);
    });
  }

  const modes = ["off", "context", "track"];
  function repeat() {
    if (!device) return;
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
        mt: "4px",
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          fontSize: "1.5rem",
          position: "relative",
        }}>
        <FontAwesomeIcon
          opacity={playbackState?.shuffle ? 1 : 0.4}
          onClick={shuffle}
          icon={faShuffle}
          cursor="pointer"
        />

        <FontAwesomeIcon
          onClick={previous}
          icon={faBackwardStep}
          cursor="pointer"
        />

        <FontAwesomeIcon
          fontSize="2rem"
          onClick={toggle}
          icon={
            playbackState === null || playbackState.paused
              ? faCirclePlay
              : faCirclePause
          }
          cursor="pointer"
        />

        <FontAwesomeIcon onClick={next} icon={faForwardStep} cursor="pointer" />

        <Box
          sx={{
            position: "relative",
            "&::after": {
              content: '"1"',
              fontSize: "0.8rem",
              fontWeight: "bold",
              display: playbackState?.repeat_mode === 2 ? "inherit" : "none",
              position: "absolute",
              right: -5,
              top: -7,
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
