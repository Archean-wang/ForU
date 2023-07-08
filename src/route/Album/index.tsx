import { useLoaderData, useParams } from "react-router-dom";
import SongList from "../../components/SongList";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { InlineArtists } from "../../components/InlineArtists";
import { showTime } from "../../utils/formatter";
import {
  checkAlbums,
  followAlbums,
  startPlayback,
  unfollowAlbums,
} from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../../store";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

function Album() {
  const params = useParams();
  // @ts-ignore
  const { album } = useLoaderData();
  const [isLoved, setIsLoved] = useState(false);
  const store = useStore();
  const device = usePlayerDevice();

  useEffect(() => {
    checkAlbums(params.id as string).then((res) => {
      setIsLoved(res[0]);
    });
  }, [params.id]);

  const toggleLoved = function () {
    if (isLoved) {
      unfollowAlbums(params.id as string).then(() => {
        setIsLoved(false);
        store.albumsStore.setAlbums();
      });
    } else {
      followAlbums(params.id as string).then(() => {
        setIsLoved(true);
        store.albumsStore.setAlbums();
      });
    }
  };

  const startPlay = useCallback(
    (index: number) => {
      startPlayback(album.uri, index);
    },
    [album]
  );
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <Box
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          gap: 10,
          mb: 2,
        }}>
        <Avatar
          src={album.images.length !== 0 ? album.images[0].url : "spotify.png"}
          variant="rounded"
          sx={{
            height: 200,
            width: 200,
          }}
        />
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Typography noWrap sx={{ fontSize: 32 }}>
            {album.name}
          </Typography>
          <InlineArtists fontSize={20} artists={album.artists}></InlineArtists>
          <Typography noWrap sx={{ fontSize: 14 }}>
            发行时间：{album.release_date}
          </Typography>
          <Typography noWrap sx={{ fontSize: 14 }}>
            曲目： {album.total_tracks}首
          </Typography>
          <Stack direction={"row"} gap={2}>
            <Button
              onClick={() => startPlay(0)}
              variant="contained"
              color="success"
              startIcon={<FontAwesomeIcon icon={faCirclePlay} />}
              sx={{
                maxWidth: 120,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}>
              播放全部
            </Button>
            <Button
              onClick={toggleLoved}
              variant="contained"
              color="success"
              startIcon={
                <FontAwesomeIcon
                  icon={faHeart}
                  color={isLoved ? "red" : "white"}
                />
              }
              sx={{
                maxWidth: 120,
              }}>
              收藏
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          items={album.tracks.items}
          handDoubleClick={(n) => {
            startPlayback(album.uri, n, device?.device_id);
          }}
          columns={[
            {
              header: "歌名",
              field: "name",
            },
            {
              header: "歌手",
              field: "artists",
            },
            {
              header: "时长",
              field: "duration_ms",
            },
          ]}
        />
      </Box>
    </Box>
  );
}

export default Album;
