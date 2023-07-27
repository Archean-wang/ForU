import { Avatar, Box, Skeleton, Stack, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import { InlineArtists } from "../../../common/InlineArtists";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkTracks, loveTracks, unloveTracks } from "../../../../api";
import EventBus, { MyEvent } from "../../../../utils/EventBus";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useCurrentTrack } from "spotify-web-playback-sdk-for-react";
import ScrollText from "../../../common/ScrollText";

function CurrentPlaying() {
  const currentTrack = useCurrentTrack();
  const [isLove, setIsLove] = useState(false);
  const currentId = currentTrack?.id;

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
      {currentTrack ? (
        <Avatar
          src={currentTrack?.album.images[0].url}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
        />
      ) : (
        <Skeleton variant="rounded" animation="wave" width={56} height={56} />
      )}

      <Stack sx={{ gap: 1, minWidth: 30 }}>
        {currentTrack ? (
          <ScrollText>
            <Typography noWrap display={"inline-block"}>
              <Link to={`/album/${currentTrack.album.uri.split(":")[2]}`}>
                {currentTrack.name}
              </Link>
            </Typography>
          </ScrollText>
        ) : (
          <Skeleton variant="text" animation="wave" width={100} height="1em" />
        )}
        {currentTrack ? (
          <ScrollText>
            <InlineArtists fontSize={12} artists={currentTrack.artists} />
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
