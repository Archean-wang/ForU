import { Box, Typography } from "@mui/material";
import { useStore } from "../../store";
import { useCallback, useEffect } from "react";
import {
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import { observer } from "mobx-react-lite";
import SongList from "../../components/SongList";
import { startPlayback } from "../../api";

function Playing() {
  const store = useStore();
  const playbackState = usePlaybackState();
  const player = useSpotifyPlayer();
  const songs = store.playingStore.playing.queue;
  const device = usePlayerDevice();

  useEffect(() => {
    console.log(playbackState);
    store.playingStore.setPlaying();
  }, [playbackState?.track_window.current_track]);

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
        当前播放
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
        即将播放
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
