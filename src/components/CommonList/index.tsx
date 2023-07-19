import SongList from "../../components/SongList";
import { Box, Typography } from "@mui/material";
import { playTracks } from "../../api";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import { Track } from "../../utils/interface";

function Commonlist({
  tracks,
  title = "列表",
}: {
  tracks: Track[];
  title?: string;
}) {
  const device = usePlayerDevice();

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
        />
      </Box>
    </Box>
  );
}

export default Commonlist;
