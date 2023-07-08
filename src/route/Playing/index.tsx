import Song from "../../components/Song";
import { Box, Typography } from "@mui/material";
import { useStore } from "../../store";
import { useEffect } from "react";
import { usePlaybackState } from "react-spotify-web-playback-sdk";
import { observer } from "mobx-react-lite";

function Playing() {
  const store = useStore();
  const playbackState = usePlaybackState();
  const songs = store.playingStore.playing?.queue.map(
    (track: any, index: number) => (
      <Song track={track} index={index} key={track.id} />
    )
  );

  useEffect(() => {
    console.log(playbackState);
    store.playingStore.setPlaying();
  }, [playbackState?.track_window.current_track]);

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
      {store.playingStore.playing?.currently_playing && (
        <Song track={store.playingStore.playing?.currently_playing} index={0} />
      )}
      <Typography
        sx={{ fontWeight: "bold", fontSize: 20, color: "gray", mt: 2 }}>
        即将播放
      </Typography>
      <Box component={"div"}>{songs}</Box>
    </Box>
  );
}

export default observer(Playing);
