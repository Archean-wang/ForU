import { Box, Tabs, Tab, Typography, Button, Avatar } from "@mui/material";
import { useLoaderData, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SongList from "../../components/SongList";
import {
  checkArtists,
  followArtists,
  playArtist,
  unfollowArtists,
} from "../../api";
import AlbumList from "../../components/AlbumList";
import ArtistList from "../../components/ArtistList";
import { useStore } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

function Artist() {
  // @ts-ignore
  const { hotTracks, albums, relatedArtists, artistInfo } = useLoaderData();
  const [value, setValue] = useState(0);

  const params = useParams();
  const [isLoved, setIsLoved] = useState(false);
  const store = useStore();
  const device = usePlayerDevice();

  useEffect(() => {
    checkArtists(params.id as string).then((res) => {
      setIsLoved(res[0]);
    });
  }, [params.id]);

  const toggleLoved = function () {
    if (isLoved) {
      unfollowArtists(params.id as string).then(() => {
        setIsLoved(false);
        store.artistsStore.setArtists();
      });
    } else {
      followArtists(params.id as string).then(() => {
        setIsLoved(true);
        store.artistsStore.setArtists();
      });
    }
  };

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setValue(newValue);
  }

  function start() {
    playArtist(`spotify:artist:${params.id}`, device?.device_id);
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          height: 200,
          mb: 2,
        }}>
        <Avatar
          src={
            artistInfo.images.length !== 0
              ? artistInfo.images[0].url
              : "/spotify.png"
          }
          variant="rounded"
          sx={{
            height: 200,
            width: 200,
          }}></Avatar>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Typography noWrap sx={{ fontSize: 32 }}>
            {artistInfo.name}
          </Typography>
          <Typography noWrap sx={{ fontSize: 20 }}>
            听众：{artistInfo.followers.total}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={start}
              variant="contained"
              color="success"
              startIcon={<FontAwesomeIcon icon={faPlayCircle} />}
              sx={{
                maxWidth: 120,
                height: 40,
              }}>
              播放
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
                height: 40,
              }}>
              收藏
            </Button>
          </Box>
        </Box>
      </Box>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="热门歌曲" />
        <Tab label="专辑" />
        <Tab label="相关艺人" />
      </Tabs>
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
        }}>
        {value === 0 && (
          <SongList
            items={hotTracks.tracks}
            handDoubleClick={(n) => {
              start();
            }}
            columns={[
              {
                header: "歌名",
                field: "name",
              },
              {
                header: "专辑",
                field: "album",
              },
              {
                header: "时长",
                field: "duration_ms",
              },
            ]}
          />
        )}
        {value == 1 && <AlbumList albums={albums.items} />}
        {value == 2 && <ArtistList artists={relatedArtists.artists} />}
      </Box>
    </Box>
  );
}

export default Artist;
