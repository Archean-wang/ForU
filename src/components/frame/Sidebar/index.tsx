import { useEffect, useState } from "react";
import {
  Avatar,
  List,
  ListItemIcon,
  ListSubheader,
  Box,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Artist,
  Playlist,
  SavedAlbum,
  SavedAlbumsItem,
  SimplePlaylist,
} from "../../../utils/interface";
import {
  faAdd,
  faCompactDisc,
  faDeleteLeft,
  faHeadphonesSimple,
  faHeart,
  faHeartBroken,
  faHouse,
  faPlayCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../../store";
import { observer } from "mobx-react-lite";
import {
  createPlaylist,
  startPlayback,
  unfollowPlaylist,
  playArtist,
  unfollowArtists,
  unfollowAlbums,
} from "../../../api";

import ListDropDownButton from "./ListDropDownButton";
import ListButton from "./ListButton";
import { useSpotifyDevice } from "spotify-web-playback-sdk-for-react";

function Sidebar() {
  const store = useStore();
  const device = useSpotifyDevice();

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
    createPlaylist(store.userProfilseStore.userProfile!.id).then((res) => {
      store.playlistsStore.setPlaylists();
      navigate(`/playlist/${res.id}`);
    });
  }

  function playPlaylist() {
    if (store.playlistsStore.playlists) {
      startPlayback(
        store.playlistsStore.playlists.items[playlistIdx].uri,
        0,
        device?.device_id
      );
    }
    setPlaylistMenu(null);
  }

  function startArtist() {
    if (store.artistsStore.artists) {
      playArtist(
        store.artistsStore.artists.artists.items[artistIdx].uri,
        device?.device_id
      );
    }
    setArtistMenu(null);
  }

  function startAlbum() {
    if (store.albumsStore.albums) {
      startPlayback(
        store.albumsStore.albums.items[albumIdx].album.uri,
        0,
        device?.device_id
      );
    }
    setAlbumMenu(null);
  }

  function unfollowArtist() {
    unfollowArtists(
      store.artistsStore.artists!.artists.items[artistIdx].id
    ).then(() => {
      store.artistsStore.setArtists();
    });
    setArtistMenu(null);
  }

  function deletePlaylist() {
    unfollowPlaylist(
      store.playlistsStore.playlists!.items[playlistIdx].id
    ).then(() => {
      store.playlistsStore.setPlaylists();
    });
    setPlaylistMenu(null);
  }

  const playlistsList = store.playlistsStore.playlists?.items.map(
    (pl: SimplePlaylist, index: number) => (
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

  const artistsList = store.artistsStore.artists?.artists.items.map(
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

  const albumsList = store.albumsStore.albums?.items.map(
    (al: SavedAlbumsItem, index: number) => (
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
        ml: 1,
        mr: 1,
        borderRadius: 2,
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
          borderBottom: "solid 1px",
          borderBottomColor: "divider",
          background: "transparent",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}>
        <Typography noWrap className="musicLibrary" sx={{ mr: "auto" }}>
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
              store.albumsStore.albums!.items[albumIdx].album.id
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
