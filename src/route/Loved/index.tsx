import { Link, useRouteLoaderData } from "react-router-dom";
import SongList from "../../components/SongList";
import { InlineArtists } from "../../components/InlineArtists";
import { Typography } from "@mui/material";
import { showTime } from "../../utils/formatter";

function Loved() {
  // @ts-ignore
  const { tracksRes, userProfile } = useRouteLoaderData("root");
  console.log(userProfile);
  return (
    <SongList
      rowKey={(v) => v.track.id}
      items={tracksRes.items}
      uri={`${userProfile.uri}:collection`}
      columns={[
        {
          header: "歌名",
          field: "track",
          render: (v) => v.name,
        },
        {
          header: "歌手",
          field: "track",
          render: (v) => <InlineArtists artists={v.artists}></InlineArtists>,
        },
        {
          header: "专辑",
          field: "track",
          render: (v) => (
            <Typography
              noWrap={true}
              sx={{ flex: 1, color: "grey", fontSize: 14 }}>
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
  );
}
export default Loved;
