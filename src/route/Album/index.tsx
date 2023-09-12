import { useLoaderData, useParams } from "react-router-dom";
import SongList from "../../components/itemsList/SongList";
import { Box, Stack, Typography } from "@mui/material";
import { InlineArtists } from "../../components/common/InlineArtists";
import {
  checkAlbums,
  followAlbums,
  startPlayback,
  unfollowAlbums,
} from "../../api";
import {
  faCirclePlay,
  faHeart,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../../store";
import InfoCard from "../../components/common/InfoCard";
import ContainedButton from "../../components/common/ContainedButton";
import { useSpotifyDevice } from "spotify-web-playback-sdk-for-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Album() {
  const params = useParams();
  // @ts-ignore
  const { album } = useLoaderData();
  const [isLoved, setIsLoved] = useState(false);
  const store = useStore();
  const device = useSpotifyDevice();

  const { t } = useTranslation();

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
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <InlineArtists artists={album.artists}></InlineArtists>
            <Typography noWrap sx={{ fontSize: "1rem" }}>
              {album.release_date}
            </Typography>
            <Typography noWrap sx={{ fontSize: "1rem" }}>
              <FontAwesomeIcon icon={faMusic} />
              {` ${album.total_tracks}`}
            </Typography>
          </Box>

          <Stack direction={"row"} gap={2}>
            <ContainedButton onClick={startPlay} icon={faCirclePlay}>
              {t("play")}
            </ContainedButton>
            <ContainedButton
              onClick={toggleLoved}
              icon={faHeart}
              color={isLoved ? "red" : "white"}>
              {t("follow")}
            </ContainedButton>
          </Stack>
        </Box>
      </InfoCard>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          items={album.tracks.items}
          handDoubleClick={(n) => {
            startPlayback(album.uri, n, device?.device_id);
          }}
          columns={[
            {
              header: t("title"),
              field: "name",
            },
            {
              header: t("artist"),
              field: "artists",
            },
            {
              header: t("duration"),
              field: "duration_ms",
            },
          ]}
        />
      </Box>
    </Box>
  );
}

export default Album;
