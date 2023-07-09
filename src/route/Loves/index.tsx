import { useRouteLoaderData } from "react-router-dom";
import SongList from "../../components/SongList";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { startPlayback } from "../../api";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

function Loves() {
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  const store = useStore();
  const device = usePlayerDevice();

  useEffect(() => {
    store.lovesStore.setLoves();
  }, []);

  function startPlay(index: number) {
    startPlayback(`${userProfile.uri}:collection`, index, device?.device_id);
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
          <FontAwesomeIcon icon={faHeart} color={"red"} fontSize={80} />
        </Avatar>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Typography noWrap sx={{ fontSize: 32, fontWeight: "bolder" }}>
            我的喜欢
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
              <Typography noWrap sx={{ fontSize: 14 }}>
                播放全部
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          items={store.lovesStore.loves.items.map((v) => v.track)}
          handDoubleClick={(n) => {
            startPlayback(
              `${userProfile.uri}:collection`,
              store.lovesStore.loves.items[n].track.uri,
              device?.device_id
            );
          }}
        />
      </Box>
    </Box>
  );
}
export default observer(Loves);
