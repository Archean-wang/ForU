import { Link } from "react-router-dom";
import SongList from "../../components/SongList";
import { Box, Typography } from "@mui/material";
import { InlineArtists } from "../../components/InlineArtists";
import { showTime } from "../../utils/formatter";
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
    console.log(device);
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
          rowKey={(v) => v.id}
          items={tracks}
          handDoubleClick={(n) => {
            startPlay(n);
          }}
          columns={[
            {
              header: "歌名",
              field: "name",
              render: (v) => <Typography noWrap>{v}</Typography>,
            },
            {
              header: "歌手",
              field: "artists",
              render: (v) => <InlineArtists artists={v}></InlineArtists>,
            },
            {
              header: "专辑",
              field: "album",
              render: (v) => (
                <Typography
                  noWrap={true}
                  sx={{ flex: 1, color: "grey", fontSize: 14 }}>
                  <Link to={`/album/${v.id}`}>{v.name}</Link>
                </Typography>
              ),
            },
            {
              header: "时长",
              field: "duration_ms",
              render: (v) => (
                <Typography
                  noWrap={true}
                  width={80}
                  sx={{
                    color: "grey",
                  }}>
                  {showTime(v)}
                </Typography>
              ),
            },
          ]}
        />
      </Box>
    </Box>
  );
}

export default Commonlist;
