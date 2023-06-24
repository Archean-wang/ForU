import {
  Avatar,
  Button,
  Slider,
  IconButton,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import {
  Devices,
  Like,
  Next,
  Pause,
  Play,
  PlayingList,
  Previous,
  Repeat,
  RepeatOne,
  Shuffle,
  VolumeFull,
  VolumeHalf,
  VolumeMute,
} from "../../icons";
import { useState } from "react";
import { setRepeatMode, setShuffleMode, transfer } from "../../api";
import { useNavigate } from "react-router-dom";
import { InlineArtists } from "../InlineArtists";
import Progress from "../Progress";
import ScrollText from "../ScrollText";

function WebPlayback({ volumeInit }: { volumeInit: number }) {
  const playbackState = usePlaybackState();
  const player = useSpotifyPlayer();
  const device = usePlayerDevice();
  const [volume, setVolume] = useState(volumeInit);
  const [hasTransfer, setHasTransfer] = useState(false);
  const navigate = useNavigate();

  if (device?.status === "ready" && !hasTransfer) {
    console.log(device.device_id);
    transfer(device.device_id, false).then(() => {
      setHasTransfer(true);
      console.log("transfer");
    });
  }

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

  function changeVolume(
    e: Event,
    value: number | Array<number>,
    activeThumb: number
  ) {
    if (typeof value === "number") {
      const v = value / 100;
      player?.setVolume(v).then(() => {
        localStorage.setItem("volume", v.toString());
        setVolume(v);
      });
    }
  }

  function mute() {
    if (volume === 0) {
      let vl = localStorage.getItem("volume");
      let v = vl === null ? 0.5 : parseFloat(vl);
      player?.setVolume(v).then(() => {
        setVolume(v);
      });
    } else {
      player?.setVolume(0).then(() => {
        setVolume(0);
      });
    }
  }

  function toggleIcon() {
    return playbackState?.paused ? (
      <Play color="#1DB954" />
    ) : (
      <Pause color="#1DB954" />
    );
  }

  function volumeIcon() {
    if (volume === 0) return <VolumeMute />;
    else if (volume <= 0.5) return <VolumeHalf />;
    return <VolumeFull />;
  }

  function repeatIcon() {
    switch (playbackState?.repeat_mode) {
      case 0:
        return <Repeat color="black" />;
      case 1:
        return <Repeat color="#1DB954" />;
      case 2:
        return <RepeatOne color="#1DB954" />;
      default:
        return <Repeat color="black" />;
    }
  }

  const ControlButton = styled(IconButton)(
    ({ theme }) => `
            width: 42px;
            height: 42px;
        `
  );

  const OtherButton = styled(IconButton)(
    ({ theme }) => `
            width: 36px;
            height: 36px;
        `
  );

  return (
    <Box
      sx={{
        height: "80px",
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        gap: 2,
      }}>
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          pl: 1,
          pr: 1,
        }}>
        <Avatar
          src={playbackState?.track_window?.current_track?.album.images[0].url}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
        />
        <Stack sx={{ overflow: "hidden", gap: 1 }}>
          <ScrollText>
            <Typography align={"left"} noWrap={true} fontSize={14}>
              {playbackState?.track_window.current_track?.name}
            </Typography>
          </ScrollText>

          <ScrollText>
            <InlineArtists
              fontSize={12}
              artists={playbackState?.track_window.current_track?.artists}
            />
          </ScrollText>
        </Stack>
        <OtherButton>
          <Like />
        </OtherButton>
      </Box>
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ControlButton onClick={shuffle}>
            <Shuffle color={playbackState?.shuffle ? "#1DB954" : "black"} />
          </ControlButton>
          <ControlButton onClick={() => player?.previousTrack()}>
            <Previous color="#1DB954" />
          </ControlButton>
          <ControlButton onClick={() => player?.togglePlay()}>
            {toggleIcon()}
          </ControlButton>
          <ControlButton onClick={() => player?.nextTrack()}>
            <Next color="#1DB954" />
          </ControlButton>
          <ControlButton onClick={repeat}>{repeatIcon()}</ControlButton>
        </Box>
        <Progress></Progress>
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}>
          <Typography
            sx={{
              color: "primary",
              fontSize: 14,
            }}>
            {showTime(position)}
          </Typography>
          <Slider
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
            }></Slider>
          <Typography
            sx={{
              color: "primary",
              fontSize: 14,
            }}>
            {showTime(playbackState?.duration)}
          </Typography>
        </Box> */}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          pr: 4,
          height: "100%",
          alignItems: "center",
        }}>
        <OtherButton onClick={() => navigate("/playing")}>
          <PlayingList />
        </OtherButton>
        <OtherButton>
          <Devices />
        </OtherButton>
        <OtherButton disabled={device?.status !== "ready"} onClick={mute}>
          {volumeIcon()}
        </OtherButton>
        <Slider
          sx={{
            marginLeft: "8px",
            maxWidth: 80,
          }}
          size="small"
          valueLabelDisplay="auto"
          value={volume * 100}
          disabled={device?.status !== "ready"}
          defaultValue={volumeInit * 100}
          onChange={changeVolume}
        />
      </Box>
    </Box>
  );
}

export default WebPlayback;
