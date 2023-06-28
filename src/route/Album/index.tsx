import { useLoaderData, useParams } from "react-router-dom";
import SongList from "../../components/SongList";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { InlineArtists } from "../../components/InlineArtists";
import { showTime } from "../../utils/formatter";
import { startPlayback } from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";

function Album() {
  const params = useParams();
  // @ts-ignore
  const { album } = useLoaderData();

  const startPlay = useCallback(
    (index: number) => {
      startPlayback(album.uri, index).then(() => {
        console.log(`${album.uri} @ ${index}`);
      });
    },
    [album]
  );
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
          src={album.images[0].url}
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
          <Typography noWrap sx={{ fontSize: 32 }}>
            {album.name}
          </Typography>
          <InlineArtists fontSize={20} artists={album.artists}></InlineArtists>
          <Typography noWrap sx={{ fontSize: 14 }}>
            发行时间：{album.release_date}
          </Typography>
          <Typography noWrap sx={{ fontSize: 14 }}>
            曲目： {album.total_tracks}首
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
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          rowKey={(v) => v.id}
          items={album.tracks.items}
          handDoubleClick={(n) => {
            startPlayback(album.uri, n);
          }}
          columns={[
            {
              header: "歌名",
              field: "name",
              render: undefined,
            },
            {
              header: "歌手",
              field: "artists",
              render: (v) => <InlineArtists artists={v}></InlineArtists>,
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

export default Album;
