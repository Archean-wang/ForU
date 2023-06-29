import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";
import SongList from "../../components/SongList";
import { InlineArtists } from "../../components/InlineArtists";
import { Avatar, Box, Typography } from "@mui/material";
import { showTime } from "../../utils/formatter";
import { startPlayback } from "../../api";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function Loved() {
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  // @ts-ignore
  const { tracksRes } = useLoaderData();
  const device = usePlayerDevice();
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
          height: 200,
          alignItems: "center",
          mb: 2,
          borderRadius: 2,
          background: "linear-gradient(to right, pink, #ff6b81)",
        }}>
        <Avatar
          variant="rounded"
          sx={{
            height: 200,
            width: 200,
            background: "transparent",
          }}>
          <FontAwesomeIcon icon={faHeart} color={"red"} fontSize={80} />
        </Avatar>
        <Typography
          noWrap
          sx={{ fontSize: 32, color: "white", fontWeight: "bolder" }}>
          我的喜欢
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          rowKey={(v) => v.track.id}
          items={tracksRes.items}
          handDoubleClick={(n) => {
            startPlayback(
              `${userProfile.uri}:collection`,
              tracksRes.items[n].track.uri,
              device?.device_id
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
