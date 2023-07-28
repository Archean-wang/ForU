import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ArtistList from "../../components/itemsList/ArtistList";
import EntityCard from "../../components/common/EntityCard";

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
        gap: 2,
        padding: 2,
        overflowY: "auto",
      }}>
      <Typography variant="h6" sx={{ bgcolor: "primary" }}>
        最爱播放
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
        }}>
        <EntityCard
          url="/always"
          image={
            store.topItemsStore.topTracks.items.length !== 0
              ? store.topItemsStore.topTracks.items[0].album.images[0].url
              : ""
          }
          title={["最多播放"]}
        />
        <EntityCard
          url="/recent"
          image={
            store.recentStore.recentTracks.items.length !== 0
              ? store.recentStore.recentTracks.items[0].track.album.images[0]
                  .url
              : ""
          }
          title={["最近播放"]}
        />
      </Box>
      <Typography variant="h6">最爱的歌手</Typography>
      <ArtistList
        artists={store.topItemsStore.topArtists.items}
        wrap="nowrap"
      />
    </Box>
  );
}

export default observer(Daily);
