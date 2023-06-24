import { Link, useLoaderData, useParams } from "react-router-dom";
import SongList from "../../components/SongList";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { InlineArtists } from "../../components/InlineArtists";
import { showTime } from "../../utils/formatter";
import { startPlayback } from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

function Playlist() {
  const params = useParams();
  // @ts-ignore
  const { playlist } = useLoaderData();
  function startPlay(index: number) {
    startPlayback(playlist.uri, index).then(() => {
      console.log(`${playlist.uri} @ ${index}`);
    });
  }
  return (
    <Box
      sx={{
        margin: 4,
      }}>
      <Box
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          gap: 10,
          mb: 2,
        }}>
        <Avatar
          src={playlist.images[0].url}
          variant="rounded"
          sx={{
            height: 200,
            width: 200,
          }}
        />
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            gap: 1,
          }}>
          <Typography sx={{ fontSize: 32 }}>{playlist.name}</Typography>
          <Typography sx={{ fontSize: 14 }}>
            详情：{playlist.description ? playlist.description : "暂无"}
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            曲目： {playlist.tracks.items.length}首
          </Typography>
          <Button
            onClick={() => startPlay(0)}
            variant="contained"
            color="success"
            startIcon={<FontAwesomeIcon icon={faCirclePlay} />}
            sx={{
              maxWidth: 120,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}>
            播放全部
          </Button>
        </Box>
      </Box>
      <SongList
        rowKey={(v) => v.track.id}
        items={playlist.tracks.items}
        uri={`spotify:playlist:${params.id}`}
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
    </Box>
  );
}

export default Playlist;
