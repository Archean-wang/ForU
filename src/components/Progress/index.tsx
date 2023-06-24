import { Box, Slider, Typography } from "@mui/material";
import { showTime } from "../../utils/formatter";
import { useEffect, useState } from "react";
import {
  usePlaybackState,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";

function getAriaValueText(value: number, index: number) {
  return showTime(value * 1000);
}

function Progress() {
  const playbackState = usePlaybackState();
  const player = useSpotifyPlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const t = setInterval(updatePosition, 500);
    return () => {
      clearInterval(t);
    };
  });

  function updatePosition() {
    player?.getCurrentState().then((v) => {
      !isDragging && v && setPosition(v.position);
    });
  }

  function onChangePositionCommitted(
    event: React.SyntheticEvent | Event,
    value: number | Array<number>
  ) {
    typeof value === "number" &&
      player?.seek(value * 1000).finally(() => {
        setIsDragging(false);
      });
  }

  function onChangePosition(
    event: Event,
    value: number | Array<number>,
    activeThumb: number
  ) {
    setIsDragging(true);
    if (typeof value === "number") {
      setPosition(value * 1000);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        mb: 1,
      }}>
      <Typography
        noWrap
        sx={{
          color: "primary",
          fontSize: 12,
        }}>
        {showTime(position)}
      </Typography>
      <Slider
        sx={{ flex: 1 }}
        size="small"
        color="primary"
        valueLabelDisplay="auto"
        valueLabelFormat={getAriaValueText}
        value={Math.floor(position / 1000)}
        onChange={onChangePosition}
        onChangeCommitted={onChangePositionCommitted}
        max={
          playbackState?.duration !== undefined
            ? Math.floor(playbackState?.duration / 1000)
            : 100
        }
      />
      <Typography
        noWrap
        sx={{
          color: "primary",
          fontSize: 10,
        }}>
        {showTime(playbackState?.duration)}
      </Typography>
    </Box>
  );
}

export default Progress;
