import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import { useLoaderData, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
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
import InfoCard from "../../components/InfoCard";
import ContainedButton from "../../components/ContainedButton";

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

  const start = useCallback(
    function () {
      playArtist(`spotify:artist:${params.id}`, device?.device_id);
    },
    [device]
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <InfoCard
        image={
          artistInfo.images.length !== 0
            ? artistInfo.images[0].url
            : "/spotify.png"
        }
        type={artistInfo.type}
        title={artistInfo.name}>
        <Stack direction={"row"} gap={2}>
          <ContainedButton onClick={start} icon={faPlayCircle}>
            播放
          </ContainedButton>
          <ContainedButton
            onClick={toggleLoved}
            icon={faHeart}
            color={isLoved ? "red" : "white"}>
            收藏
          </ContainedButton>
        </Stack>
      </InfoCard>

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
