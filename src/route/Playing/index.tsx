import { Box, Typography } from "@mui/material";
import { useStore } from "../../store";
import { useCallback, useEffect } from "react";

import { observer } from "mobx-react-lite";
import SongList from "../../components/itemsList/SongList";
import { startPlayback } from "../../api";
import {
  useCurrentTrack,
  useSpotifyDevice,
  useSpotifyPlayer,
  useSpotifyState,
} from "spotify-web-playback-sdk-for-react";
import { useTranslation } from "react-i18next";

function Playing() {
  const store = useStore();
  const playbackState = useSpotifyState();
  const currentTrack = useCurrentTrack();
  const player = useSpotifyPlayer();
  const songs = store.playingStore.playing.queue;
  const device = useSpotifyDevice();

  const { t } = useTranslation();

  useEffect(() => {
    store.playingStore.setPlaying();
  }, [currentTrack]);

  const toggle = useCallback(function () {
    player?.togglePlay();
  }, []);

  function onDoubleClick(n: number) {
    startPlayback(
      playbackState?.context.uri as string,
      songs[n].uri,
      device?.device_id
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        margin: 2,
        padding: 2,
      }}
      component={"div"}>
      <Typography sx={{ fontWeight: "bold", fontSize: 20, color: "gray" }}>
        {t("nowPlaying")}
      </Typography>
      {store.playingStore.playing.currently_playing && (
        <SongList
          items={[store.playingStore.playing.currently_playing]}
          handDoubleClick={toggle}
          fixHeight={false}
          hideHead={true}
        />
      )}
      <Typography
        sx={{ fontWeight: "bold", fontSize: 20, color: "gray", mt: 2 }}>
        {t("nextUp")}
      </Typography>

      <SongList
        items={songs}
        handDoubleClick={onDoubleClick}
        fixHeight={false}
        hideHead={true}
      />
    </Box>
  );
}

export default observer(Playing);
