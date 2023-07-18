import { Avatar, Box, Skeleton, Stack, Typography } from "@mui/material";
import { usePlaybackState } from "react-spotify-web-playback-sdk";
import ScrollText from "../ScrollText";
import { Link } from "react-router-dom";
import { InlineArtists } from "../InlineArtists";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkTracks, loveTracks, unloveTracks } from "../../api";
import EventBus, { MyEvent } from "../../utils/EventBus";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function CurrentPlaying() {
  const playbackState = usePlaybackState();
  const hasTransfer = playbackState?.track_window.current_track;
  const [isLove, setIsLove] = useState(false);
  const currentId = playbackState?.track_window.current_track?.id;

  useEffect(() => {
    if (currentId) {
      checkTracks(currentId).then((res) => {
        setIsLove(res[0]);
      });
    }
  }, [currentId]);

  useEffect(() => {
    const handle = (e: MyEvent) => {
      if (e.id === currentId) {
        setIsLove(e.value);
      }
    };
    EventBus.addHandle("loveTrack", handle);

    return () => {
      EventBus.removeHandle("loveTrack", handle);
    };
  }, [currentId]);

  function handLove() {
    if (!currentId) return;
    if (isLove) {
      unloveTracks(currentId).then(() => {
        EventBus.trigger({ name: "loveTrack", id: currentId, value: false });
      });
    } else {
      loveTracks(currentId).then(() => {
        EventBus.trigger({ name: "loveTrack", id: currentId, value: true });
      });
    }
  }

  return (
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
          src={playbackState?.track_window?.current_track?.album.images[0].url}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
        />
      ) : (
        <Skeleton variant="rounded" animation="wave" width={56} height={56} />
      )}

      <Stack sx={{ gap: 1, minWidth: 30 }}>
        {hasTransfer ? (
          <ScrollText>
            <Typography noWrap display={"inline-block"}>
              <Link
                to={`/album/${
                  playbackState?.track_window.current_track.album.uri.split(
                    ":"
                  )[2]
                }`}>
                {playbackState?.track_window.current_track?.name}
              </Link>
            </Typography>
          </ScrollText>
        ) : (
          <Skeleton variant="text" animation="wave" width={100} height="1em" />
        )}
        {hasTransfer ? (
          <ScrollText>
            <InlineArtists
              fontSize={12}
              artists={playbackState?.track_window.current_track?.artists}
            />
          </ScrollText>
        ) : (
          <Skeleton variant="text" animation="wave" width={100} height="1em" />
        )}
      </Stack>

      <Box
        sx={{ width: 20, color: isLove ? "primary.main" : "secondary.main" }}>
        <FontAwesomeIcon onClick={handLove} icon={faHeart} cursor="pointer" />
      </Box>
    </Box>
  );
}

export default CurrentPlaying;
