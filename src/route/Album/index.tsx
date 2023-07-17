import { useLoaderData, useParams } from "react-router-dom";
import SongList from "../../components/SongList";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { InlineArtists } from "../../components/InlineArtists";
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
import InfoCard from "../../components/InfoCard";
import ContainedButton from "../../components/ContainedButton";

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

  const startPlay = useCallback(() => {
    startPlayback(album.uri, 0, device?.device_id);
  }, [album, device]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <InfoCard
        image={album.images.length === 0 ? undefined : album.images[0].url}
        title={album.name}
        type={album.type}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <InlineArtists artists={album.artists}></InlineArtists>
            <Typography noWrap sx={{ fontSize: 14 }}>
              {album.release_date}
            </Typography>
            <Typography noWrap sx={{ fontSize: 14 }}>
              {album.total_tracks}首
            </Typography>
          </Box>

          <Stack direction={"row"} gap={2}>
            <ContainedButton onClick={startPlay} icon={faCirclePlay}>
              播放
            </ContainedButton>
            <ContainedButton
              onClick={toggleLoved}
              icon={faHeart}
              color={isLoved ? "red" : "white"}>
              收藏
            </ContainedButton>
          </Stack>
        </Box>
      </InfoCard>

      <Box sx={{ flex: 1 }}>
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
