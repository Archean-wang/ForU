import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";
import SongList from "../../components/SongList";
import { InlineArtists } from "../../components/InlineArtists";
import { Box, Typography } from "@mui/material";
import { showTime } from "../../utils/formatter";
import { startPlayback } from "../../api";

function Loved() {
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  // @ts-ignore
  const { tracksRes } = useLoaderData();
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          rowKey={(v) => v.track.id}
          items={tracksRes.items}
          handDoubleClick={(n) => {
            startPlayback(
              `${userProfile.uri}:collection`,
              tracksRes.items[n].track.uri
            );
          }}
          columns={[
            {
              header: "歌名",
              field: "track",
              render: (v) => <Typography noWrap>{v.name}</Typography>,
            },
            {
              header: "歌手",
              field: "track",
              render: (v) => <InlineArtists artists={v.artists} />,
            },
            {
              header: "专辑",
              field: "track",
              render: (v) => (
                <Typography noWrap sx={{ color: "grey", fontSize: 14 }}>
                  <Link to={`/album/${v.album.id}`}>{v.album.name}</Link>
                </Typography>
              ),
            },
            {
              header: "时长",
              field: "track",
              render: (v) => (
                <Typography
                  noWrap={true}
                  width={80}
                  sx={{
                    color: "grey",
                  }}>
                  {showTime(v.duration_ms)}
                </Typography>
              ),
            },
          ]}
        />
      </Box>
    </Box>
  );
}
export default Loved;
