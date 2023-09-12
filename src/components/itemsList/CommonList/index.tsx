import SongList from "../SongList";
import { Box, Typography } from "@mui/material";
import { playTracks } from "../../../api";
import { Track } from "../../../utils/interface";
import { useSpotifyDevice } from "spotify-web-playback-sdk-for-react";

interface CommonListProps {
  tracks: Track[];
  title?: string;
  loadMore?: Function;
}

function CommonList({ tracks, title = "List", loadMore }: CommonListProps) {
  const device = useSpotifyDevice();

  function startPlay(index: number) {
    playTracks(
      tracks.map((v) => v.uri),
      tracks[index].uri,
      device?.device_id
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}>
      <Typography variant="h4">{title}</Typography>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          items={tracks}
          handDoubleClick={(n) => {
            startPlay(n);
          }}
          loadMore={loadMore}
        />
      </Box>
    </Box>
  );
}

export default CommonList;
