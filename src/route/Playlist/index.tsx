import {
  Link,
  useLoaderData,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import SongList from "../../components/SongList";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { InlineArtists } from "../../components/InlineArtists";
import { showTime } from "../../utils/formatter";
import {
  checkPlaylist,
  followPlaylist,
  startPlayback,
  unfollowPlaylist,
} from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

function Playlist() {
  const params = useParams();
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  // @ts-ignore
  const { playlist } = useLoaderData();
  const [isLoved, setIsLoved] = useState(false);
  const store = useStore();
  const device = usePlayerDevice();

  useEffect(() => {
    checkPlaylist(params.id as string, userProfile.id).then((res) => {
      setIsLoved(res[0]);
    });
  }, []);

  const toggleLoved = function () {
    if (isLoved) {
      unfollowPlaylist(params.id as string).then(() => {
        setIsLoved(false);
        store.playlistsStore.setPlaylists();
      });
    } else {
      followPlaylist(params.id as string).then(() => {
        setIsLoved(true);
        store.playlistsStore.setPlaylists();
      });
    }
  };

  function startPlay(index: number) {
    startPlayback(playlist.uri, index, device?.device_id);
  }
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
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Typography noWrap sx={{ fontSize: 32 }}>
            {playlist.name}
          </Typography>
          <Typography noWrap sx={{ fontSize: 14 }}>
            详情：{playlist.description ? playlist.description : "暂无"}
          </Typography>
          <Typography noWrap sx={{ fontSize: 14 }}>
            曲目： {playlist.tracks.items.length}首
          </Typography>
          <Stack direction={"row"} gap={2}>
            <Button
              onClick={() => startPlay(0)}
              variant="contained"
              color="success"
              startIcon={<FontAwesomeIcon icon={faCirclePlay} />}
              sx={{
                maxWidth: 120,
              }}>
              播放全部
            </Button>
            <Button
              onClick={toggleLoved}
              variant="contained"
              color="success"
              startIcon={
                <FontAwesomeIcon
                  icon={faHeart}
                  color={isLoved ? "red" : "white"}
                />
              }
              sx={{
                maxWidth: 120,
              }}>
              收藏
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          rowKey={(v) => v.track.id}
          items={playlist.tracks.items}
          handDoubleClick={(n) => {
            startPlayback(playlist.uri, n);
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
              render: (v) => (
                <InlineArtists artists={v.artists}></InlineArtists>
              ),
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
    </Box>
  );
}

export default Playlist;
