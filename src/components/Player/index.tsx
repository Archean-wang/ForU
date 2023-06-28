import {
  Avatar,
  Slider,
  Typography,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";

import {
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import { useCallback, useEffect, useState } from "react";
import {
  checkTracks,
  loveTracks,
  setRepeatMode,
  setShuffleMode,
  transfer,
  unloveTracks,
} from "../../api";
import { useNavigate } from "react-router-dom";
import { InlineArtists } from "../InlineArtists";
import Progress from "../Progress";
import ScrollText from "../ScrollText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faBars,
  faCirclePause,
  faCirclePlay,
  faForwardStep,
  faHeart,
  faLaptop,
  faRepeat,
  faShuffle,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";

function Player({ volumeInit }: { volumeInit: number }) {
  const playbackState = usePlaybackState();
  const player = useSpotifyPlayer();
  const device = usePlayerDevice();
  const [volume, setVolume] = useState(volumeInit);
  const hasTransfer = playbackState?.track_window.current_track;
  const navigate = useNavigate();
  const [isLove, setIsLove] = useState(false);
  const currentId = playbackState?.track_window.current_track?.id;

  console.log(playbackState);

  useEffect(() => {
    if (device?.status === "ready" && !hasTransfer) {
      console.log(device.device_id);
      transfer(device.device_id, false).then(() => {
        // setHasTransfer(true);
      });
    }
  }, [device?.status, hasTransfer]);

  useEffect(() => {
    check();
  }, [currentId]);

  function check() {
    if (currentId) {
      checkTracks(currentId).then((res) => {
        res[0] ? setIsLove(true) : setIsLove(false);
      });
    }
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

  function changeVolume(e: Event, value: number | Array<number>) {
    if (typeof value === "number") {
      const v = value / 100;
      player?.setVolume(v).then(() => {
        localStorage.setItem("volume", value.toString());
        setVolume(value);
      });
    }
  }

  function mute() {
    if (volume === 0) {
      let vl = localStorage.getItem("volume");
      let v = vl === null ? 50 : parseInt(vl);
      player?.setVolume(v / 100).then(() => {
        setVolume(v);
      });
    } else {
      player?.setVolume(0).then(() => {
        setVolume(0);
      });
    }
  }

  const volumeIcon = useCallback((v: number) => {
    if (v === 0) return faVolumeOff;
    else if (v <= 50) return faVolumeLow;
    return faVolumeHigh;
  }, []);

  const handLove = () => {
    if (!currentId) return;
    if (isLove) {
      unloveTracks(currentId).then(() => {
        setIsLove(false);
      });
    } else {
      loveTracks(currentId).then(() => {
        setIsLove(true);
      });
    }
  };

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
          minWidth: 58,
          pl: 1,
          pr: 1,
          gap: 1,
        }}>
        {hasTransfer ? (
          <Avatar
            src={
              playbackState?.track_window?.current_track?.album.images[0].url
            }
            variant="rounded"
            sx={{ width: 56, height: 56 }}
          />
        ) : (
          <Skeleton variant="rounded" animation="wave" width={56} height={56} />
        )}

        <Stack sx={{ overflow: "hidden", gap: 1 }}>
          {hasTransfer ? (
            <ScrollText>
              <Typography align={"left"} noWrap={true} fontSize={14}>
                {playbackState?.track_window.current_track?.name}
              </Typography>
            </ScrollText>
          ) : (
            <Skeleton
              variant="text"
              animation="wave"
              width={100}
              height="1em"
            />
          )}
          {hasTransfer ? (
            <ScrollText>
              <InlineArtists
                fontSize={12}
                artists={playbackState?.track_window.current_track?.artists}
              />
            </ScrollText>
          ) : (
            <Skeleton
              variant="text"
              animation="wave"
              width={100}
              height="1em"
            />
          )}
        </Stack>

        <FontAwesomeIcon
          onClick={handLove}
          icon={faHeart}
          color={isLove ? "#1DB954" : "grey"}
          cursor="pointer"
        />
      </Box>
      {/* 中部按钮 */}
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
            icon={!playbackState?.paused ? faCirclePause : faCirclePlay}
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
      {/* 右侧按钮 */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          pr: 4,
          height: "100%",
          alignItems: "center",
          gap: 2,
        }}>
        <FontAwesomeIcon
          onClick={() => navigate("/playing")}
          icon={faBars}
          cursor="pointer"
        />

        <FontAwesomeIcon icon={faLaptop} cursor="pointer" />
        <FontAwesomeIcon
          icon={volumeIcon(volume)}
          cursor="pointer"
          onClick={mute}
        />

        <Slider
          sx={{
            marginLeft: "8px",
            maxWidth: 80,
            ml: 0,
            "& .MuiSlider-thumb": {
              display: "none",
            },
            "&:hover .MuiSlider-thumb": {
              display: "block",
            },
          }}
          size="small"
          valueLabelDisplay="auto"
          value={volume}
          disabled={device?.status !== "ready"}
          defaultValue={volumeInit}
          onChange={changeVolume}
        />
      </Box>
    </Box>
  );
}

export default Player;
