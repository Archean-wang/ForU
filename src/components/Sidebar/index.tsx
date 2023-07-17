import { useEffect, useState } from "react";
import {
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Box,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { Anchor, Artist, Playlist, SavedAlbum } from "../../utils/interface";
import {
  faAdd,
  faCompactDisc,
  faDeleteLeft,
  faFolder,
  faHeadphonesSimple,
  faHeart,
  faHeartBroken,
  faHouse,
  faMusic,
  faPlayCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../store";
import { observer } from "mobx-react-lite";
import {
  createPlaylist,
  startPlayback,
  unfollowPlaylist,
  playArtist,
  unfollowArtists,
  unfollowAlbums,
} from "../../api";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import ListDropDownButton from "../ListDropDownButton";
import ListButton from "../ListButton";

function Sidebar() {
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  const store = useStore();
  const device = usePlayerDevice();

  const [playlistMenu, setPlaylistMenu] = useState<Anchor | null>(null);
  const [playlistIdx, setPlaylistIdx] = useState(-1);

  const [artistMenu, setArtistMenu] = useState<Anchor | null>(null);
  const [artistIdx, setArtistIdx] = useState(-1);

  const [albumMenu, setAlbumMenu] = useState<Anchor | null>(null);
  const [albumIdx, setAlbumIdx] = useState(-1);

  const navigate = useNavigate();

  useEffect(() => {
    store.playlistsStore.setPlaylists();
    store.albumsStore.setAlbums();
    store.artistsStore.setArtists();
  }, []);

  function handlePlaylistClose() {
    setPlaylistMenu(null);
  }

  function handleArtistClose() {
    setArtistMenu(null);
  }

  function handleAlbumClose() {
    setAlbumMenu(null);
  }

  function addPlaylist() {
    createPlaylist(userProfile.id).then((res) => {
      store.playlistsStore.setPlaylists();
      navigate(`/playlist/${res.id}`);
    });
  }

  function playPlaylist() {
    startPlayback(
      store.playlistsStore.playlists.items[playlistIdx].uri,
      0,
      device?.device_id
    );
    setPlaylistMenu(null);
  }

  function startArtist() {
    playArtist(
      store.artistsStore.artists.artists.items[artistIdx].uri,
      device?.device_id
    );
    setArtistMenu(null);
  }

  function startAlbum() {
    startPlayback(
      store.albumsStore.albums.items[albumIdx].album.uri,
      0,
      device?.device_id
    );
    setAlbumMenu(null);
  }

  function unfollowArtist() {
    unfollowArtists(
      store.artistsStore.artists.artists.items[artistIdx].id
    ).then(() => {
      store.artistsStore.setArtists();
    });
    setArtistMenu(null);
  }

  function deletePlaylist() {
    unfollowPlaylist(store.playlistsStore.playlists.items[playlistIdx].id).then(
      () => {
        store.playlistsStore.setPlaylists();
      }
    );
    setPlaylistMenu(null);
  }

  const playlistsList = store.playlistsStore.playlists.items.map(
    (pl: Playlist, index: number) => (
      <ListButton
        primary={pl.name}
        onContextMenu={(e) => {
          setPlaylistIdx(index);
          e.preventDefault();
          setPlaylistMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
          });
        }}
        key={pl.id}
        icon={
          <Avatar
            src={pl.images.length !== 0 ? pl.images[0].url : "/spotify.png"}
            variant="rounded"
          />
        }
        onClick={() => navigate(`/playlist/${pl.id}`)}
      />
    )
  );

  const artistsList = store.artistsStore.artists.artists.items.map(
    (ar: Artist, index: number) => (
      <ListButton
        primary={ar.name}
        onContextMenu={(e) => {
          setArtistIdx(index);
          e.preventDefault();
          setArtistMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
          });
        }}
        key={ar.id}
        icon={<Avatar src={ar.images[0].url} variant="rounded" />}
        onClick={() => navigate(`/artist/${ar.id}`)}
      />
    )
  );

  const albumsList = store.albumsStore.albums.items.map(
    (al: SavedAlbum, index: number) => (
      <ListButton
        icon={<Avatar src={al.album.images[0].url} variant="rounded" />}
        primary={al.album.name}
        onClick={() => navigate(`/album/${al.album.id}`)}
        onContextMenu={(e) => {
          setAlbumIdx(index);
          e.preventDefault();
          setAlbumMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
          });
        }}
        key={al.album.id}
      />
    )
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        width: "100%",
        ml: 2,
        mr: 2,
        borderRadius: 1,
        flex: 3,
        overflowY: "auto",
        overflowX: "hidden",
        "@media (max-width: 800px)": {
          minWidth: 75,
          maxWidth: 75,
        },
        "@media (min-width: 800px)": {
          maxWidth: 200,
        },
      }}>
      <List dense>
        <ListButton
          primary="主页"
          icon={faHouse}
          onClick={() => navigate("/")}
        />
        <ListButton
          primary="我喜欢的"
          icon={faHeart}
          iconColor="primary.main"
          onClick={() => navigate("/loves")}
        />
      </List>
      <ListSubheader
        component="div"
        sx={{
          backgroundColor: "divider",
          mt: 1,
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "@media (max-width: 800px)": {
            ".musicLibrary": { display: "none" },
          },
        }}>
        <FontAwesomeIcon icon={faMusic} />
        <Typography noWrap className="musicLibrary">
          音乐库
        </Typography>

        <FontAwesomeIcon
          title="添加歌单"
          icon={faAdd}
          cursor="pointer"
          onClick={addPlaylist}
        />
      </ListSubheader>
      <List
        sx={{
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        component="nav">
        <ListDropDownButton title="歌单" icon={faHeadphonesSimple}>
          {playlistsList}
        </ListDropDownButton>
        <ListDropDownButton title="歌手" icon={faUser}>
          {artistsList}
        </ListDropDownButton>
        <ListDropDownButton title="专辑" icon={faCompactDisc}>
          {albumsList}
        </ListDropDownButton>
      </List>

      <Menu
        open={playlistMenu !== null}
        onClose={handlePlaylistClose}
        anchorReference="anchorPosition"
        anchorPosition={
          playlistMenu !== null
            ? { top: playlistMenu.mouseY, left: playlistMenu.mouseX }
            : undefined
        }>
        <MenuItem onClick={playPlaylist} dense>
          <ListItemIcon>
            <FontAwesomeIcon icon={faPlayCircle} />
          </ListItemIcon>
          播放
        </MenuItem>
        <MenuItem onClick={deletePlaylist} dense>
          <ListItemIcon>
            <FontAwesomeIcon icon={faDeleteLeft} />
          </ListItemIcon>
          删除歌单
        </MenuItem>
      </Menu>

      <Menu
        open={artistMenu !== null}
        onClose={handleArtistClose}
        anchorReference="anchorPosition"
        anchorPosition={
          artistMenu !== null
            ? { top: artistMenu.mouseY, left: artistMenu.mouseX }
            : undefined
        }>
        <MenuItem onClick={startArtist} dense>
          <ListItemIcon>
            <FontAwesomeIcon icon={faPlayCircle} />
          </ListItemIcon>
          播放
        </MenuItem>
        <MenuItem onClick={unfollowArtist} dense>
          <ListItemIcon>
            <FontAwesomeIcon icon={faHeartBroken} />
          </ListItemIcon>
          取消关注
        </MenuItem>
      </Menu>

      <Menu
        open={albumMenu !== null}
        onClose={handleAlbumClose}
        anchorReference="anchorPosition"
        anchorPosition={
          albumMenu !== null
            ? { top: albumMenu.mouseY, left: albumMenu.mouseX }
            : undefined
        }>
        <MenuItem onClick={startAlbum} dense>
          <ListItemIcon>
            <FontAwesomeIcon icon={faPlayCircle} />
          </ListItemIcon>
          播放
        </MenuItem>
        <MenuItem
          dense
          onClick={() => {
            unfollowAlbums(
              store.albumsStore.albums.items[albumIdx].album.id
            ).then(() => {
              store.albumsStore.setAlbums();
            });
            setAlbumMenu(null);
          }}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faHeartBroken} />
          </ListItemIcon>
          取消收藏
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default observer(Sidebar);
