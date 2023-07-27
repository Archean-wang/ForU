import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";
import SongList from "../../components/itemsList/SongList";
import { Box, Stack, Typography } from "@mui/material";
import {
  changePlaylistCover,
  changePlaylistDetail,
  checkPlaylist,
  followPlaylist,
  startPlayback,
  unfollowPlaylist,
} from "../../api";
import {
  faCirclePlay,
  faEdit,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useStore } from "../../store";

import EditPlaylist, {
  PlaylistDetail,
} from "../../components/common/EditPlaylist";
import { PlaylistTrack, Track } from "../../utils/interface";
import { observer } from "mobx-react-lite";
import EventBus, { MyEvent } from "../../utils/EventBus";
import InfoCard from "../../components/common/InfoCard";
import ContainedButton from "../../components/common/ContainedButton";
import { useSpotifyDevice } from "spotify-web-playback-sdk-for-react";

function Playlist() {
  const params = useParams();
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  // @ts-ignore
  const { playlist } = useLoaderData();
  const [items, setItems] = useState(
    playlist.tracks.items.map((v: PlaylistTrack) => v.track)
  );
  const [isLoved, setIsLoved] = useState(false);
  const store = useStore();
  const device = useSpotifyDevice();
  const [open, setOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    playlist.images.length !== 0 ? playlist.images[0].url : "/spotify.png"
  );
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);

  useEffect(() => {
    checkPlaylist(params.id as string, userProfile.id).then((res) => {
      setIsLoved(res[0]);
    });
    // 删除事件更新UI
    const handle = (e: MyEvent) => {
      if (e.action === "delete") {
        console.log(e);
        const tmp = items.filter((v: Track) => v.uri !== e.uri);
        console.log(tmp);
        setItems(tmp);
      }
    };

    EventBus.addHandle("playlist", handle);

    return () => {
      EventBus.removeHandle("playlist", handle);
    };
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

  const editPlaylist = function () {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommit = (data: PlaylistDetail) => {
    if (data.imageUrl !== imageUrl) {
      const base64Image = data.imageUrl.split(",")[1];
      changePlaylistCover(playlist.id, base64Image).then(() => {
        setImageUrl(data.imageUrl);
      });
    }
    if (data.name !== name || data.description !== description) {
      changePlaylistDetail(playlist.id, data)
        .then(() => {
          setName(data.name);
          setDescription(data.description);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setOpen(false);
  };

  function startPlay(index: number) {
    console.log(device);
    startPlayback(playlist.uri, index, device?.device_id);
  }
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <InfoCard title={name} image={imageUrl} type={playlist.type}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: 1,
          }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography maxHeight="3rem" overflow="hidden">
              {description ? description : ""}
            </Typography>
            <Typography noWrap sx={{ maxWidth: 200 }}>
              {playlist.tracks.items.length}首
            </Typography>
          </Box>

          <Stack direction={"row"} gap={2} alignItems="flex-end">
            <ContainedButton onClick={() => startPlay(0)} icon={faCirclePlay}>
              播放
            </ContainedButton>
            {playlist.owner.id === userProfile.id ? (
              <ContainedButton onClick={editPlaylist} icon={faEdit}>
                编辑
              </ContainedButton>
            ) : (
              <ContainedButton
                onClick={toggleLoved}
                icon={faHeart}
                color={isLoved ? "red" : "white"}>
                收藏
              </ContainedButton>
            )}
          </Stack>
        </Box>
      </InfoCard>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <SongList
          currentPlaylist={playlist}
          items={items}
          handDoubleClick={(n) => {
            startPlayback(playlist.uri, n, device?.device_id);
          }}
        />
      </Box>

      <EditPlaylist
        open={open}
        handleClose={handleClose}
        handleCommit={handleCommit}
        playlist={playlist}
      />
    </Box>
  );
}

export default observer(Playlist);
