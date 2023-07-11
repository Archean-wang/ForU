import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArtistList from "../../components/ArtistList";
import { useStore } from "../../store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

function Daily() {
  const store = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    store.topItemsStore.setTopArtists();
    store.topItemsStore.setTopTracks();
    store.recentStore.setRecentTracks();
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: 4,
        overflowY: "auto",
      }}>
      <Typography variant="h5" sx={{ bgcolor: "primary" }}>
        经常播放
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
        }}>
        <Box
          onClick={() => navigate(`/always`)}
          sx={{
            height: 200,
            width: 160,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            gap: 1,
            padding: 1,
          }}>
          <Avatar
            variant="rounded"
            src={
              store.topItemsStore.topTracks.items.length !== 0
                ? store.topItemsStore.topTracks.items[0].album.images[0].url
                : ""
            }
            sx={{ width: 140, height: 140, alignSelf: "center" }}
          />
          <Typography
            noWrap
            fontSize={10}
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            最多播放
          </Typography>
        </Box>
        <Box
          onClick={() => navigate(`/recent`)}
          sx={{
            height: 200,
            width: 160,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            gap: 1,
            padding: 1,
          }}>
          <Avatar
            variant="rounded"
            src={
              store.recentStore.recentTracks.items.length !== 0
                ? store.recentStore.recentTracks.items[0].track.album.images[0]
                    .url
                : ""
            }
            sx={{ width: 140, height: 140, alignSelf: "center" }}
          />
          <Typography
            noWrap
            fontSize={10}
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            最近播放
          </Typography>
        </Box>
      </Box>
      <Typography variant="h5">常听歌手</Typography>
      <ArtistList
        artists={store.topItemsStore.topArtists.items}
        wrap="nowrap"
      />
    </Box>
  );
}

export default observer(Daily);
