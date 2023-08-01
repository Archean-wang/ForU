import SongList from "../../components/itemsList/SongList";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { startPlayback } from "../../api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import EventBus from "../../utils/EventBus";
import { useSpotifyDevice } from "spotify-web-playback-sdk-for-react";
import ContainedButton from "../../components/common/ContainedButton";
import Loading from "../../components/common/Loading";

function Loves() {
  const store = useStore();
  const device = useSpotifyDevice();
  const [loading, setLoading] = useState(false);

  function handle() {
    store.lovesStore.setLoves();
  }

  useEffect(() => {
    handle();
    EventBus.addHandle("loveTrack", handle);
    return () => {
      EventBus.removeHandle("loveTrack", handle);
    };
  }, []);

  const startPlay = function (index: number) {
    startPlayback(
      `${store.userProfilseStore.userProfile!.uri}:collection`,
      index,
      device?.device_id
    );
  };

  function loadNext() {
    setLoading(true);
    store.lovesStore.next().then(() => {
      setLoading(false);
    });
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
          display: "flex",
          gap: 4,
          height: 200,
          alignItems: "center",
          mb: 2,
          borderRadius: 2,
        }}>
        <Avatar
          variant="rounded"
          sx={{
            height: 200,
            width: 200,
            background: "#f3f2f1",
          }}>
          <FontAwesomeIcon icon={faHeart} color={"red"} fontSize="5rem" />
        </Avatar>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Typography noWrap sx={{ fontSize: "2rem", fontWeight: "bolder" }}>
            我喜欢的
          </Typography>
          <Stack direction={"row"} gap={2}>
            <ContainedButton onClick={() => startPlay(0)} icon={faCirclePlay}>
              播放
            </ContainedButton>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          loadMore={loadNext}
          items={store.lovesStore.loves.items.map((v) => v.track)}
          handDoubleClick={(n) => {
            startPlayback(
              `${store.userProfilseStore.userProfile!.uri}:collection`,
              store.lovesStore.loves.items[n].track.uri,
              device?.device_id
            );
          }}
        />
      </Box>
      {loading && <Loading />}
    </Box>
  );
}
export default observer(Loves);
