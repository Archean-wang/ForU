import { useEffect, useState } from "react";
import {
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Collapse,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { Artist, Playlist, SavedAlbum } from "../../utils/interface";
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faCompactDisc,
  faDeleteLeft,
  faHeadphonesSimple,
  faHeart,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../store";
import { observer } from "mobx-react-lite";
import { createPlaylist } from "../../api";

function Sidebar() {
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  const store = useStore();

  const [playlistsOpen, setPlaylistsOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const [albumsOpen, setAlbumsOpen] = useState(false);

  const [playlistMenu, setPlaylistMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [optIdx, setOptIdx] = useState(-1);

  const navigate = useNavigate();

  useEffect(() => {
    store.playlistsStore.setPlaylists();
    store.albumsStore.setAlbums();
    store.artistsStore.setArtists();
  }, []);

  function handlePlaylistClose() {
    setPlaylistMenu(null);
  }

  function addPlaylist() {
    createPlaylist(userProfile.id).then((res) => {
      store.playlistsStore.setPlaylists();
      setPlaylistMenu(null);
    });
  }

  function deletePlaylist() {
    console.log(`未提供API`);
    console.log(
      `delete playlist index: ${optIdx}, name: ${store.playlistsStore.playlists.items[optIdx].name}`
    );
    setPlaylistMenu(null);
  }

  const playlistsList = store.playlistsStore.playlists.items.map(
    (pl: Playlist, index: number) => (
      <ListItemButton
        onContextMenu={(e) => {
          setOptIdx(index);
          e.preventDefault();
          setPlaylistMenu(
            playlistMenu === null
              ? {
                  mouseX: e.clientX + 2,
                  mouseY: e.clientY - 6,
                }
              : null
          );
        }}
        sx={{ pl: 4 }}
        key={pl.id}
        onClick={() => navigate(`/playlist/${pl.id}`)}>
        <ListItemIcon>
          <Avatar
            src={pl.images.length !== 0 ? pl.images[0].url : "/spotify.png"}
            variant="rounded"
          />
        </ListItemIcon>
        <ListItemText primary={pl.name} />
      </ListItemButton>
    )
  );

  const artistsList = store.artistsStore.artists.artists.items.map(
    (ar: Artist) => (
      <ListItemButton
        sx={{ pl: 4 }}
        key={ar.id}
        onClick={() => navigate(`/artist/${ar.id}`)}>
        <ListItemIcon>
          <Avatar src={ar.images[0].url} variant="rounded" />
        </ListItemIcon>
        <ListItemText primary={ar.name} />
      </ListItemButton>
    )
  );

  const albumsList = store.albumsStore.albums.items.map((al: SavedAlbum) => (
    <ListItemButton
      sx={{ pl: 4 }}
      key={al.album.id}
      onClick={() => navigate(`/album/${al.album.id}`)}>
      <ListItemIcon>
        <Avatar src={al.album.images[0].url} variant="rounded" />
      </ListItemIcon>
      <ListItemText
        primary={al.album.name}
        title={al.album.name}
        sx={{ whiteSpace: "nowrap" }}
      />
    </ListItemButton>
  ));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 240,
        minWidth: 240,
        overflowY: "auto",
        // borderRight: " solid 8px grey",
      }}>
      <List dense>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon
            sx={{
              alignItems: "center",
            }}>
            <FontAwesomeIcon icon={faHouse} />
          </ListItemIcon>
          <ListItemText primary="主页" />
        </ListItemButton>
        <ListItemButton divider onClick={() => navigate("/loves")}>
          <ListItemIcon
            sx={{
              alignItems: "center",
            }}>
            <FontAwesomeIcon icon={faHeart} color="#1DB954" />
          </ListItemIcon>
          <ListItemText primary="我喜欢的" />
        </ListItemButton>
      </List>
      <List
        sx={{
          width: "100%",
          overflowY: "auto",
        }}
        component="nav"
        subheader={<ListSubheader component="div">我的音乐库</ListSubheader>}
        dense>
        <ListItemButton onClick={() => setPlaylistsOpen(!playlistsOpen)}>
          <ListItemIcon
            sx={{
              alignItems: "center",
            }}>
            <FontAwesomeIcon icon={faHeadphonesSimple} />
          </ListItemIcon>
          <ListItemText primary="歌单" />
          {playlistsOpen ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
        </ListItemButton>
        <Collapse in={playlistsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {playlistsList}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setArtistsOpen(!artistsOpen)}>
          <ListItemIcon
            sx={{
              alignItems: "center",
            }}>
            <FontAwesomeIcon icon={faUser} />
          </ListItemIcon>
          <ListItemText primary="歌手" />
          {artistsOpen ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
        </ListItemButton>
        <Collapse in={artistsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {artistsList}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setAlbumsOpen(!albumsOpen)}>
          <ListItemIcon
            sx={{
              alignItems: "center",
            }}>
            <FontAwesomeIcon icon={faCompactDisc} />
          </ListItemIcon>
          <ListItemText primary="专辑" />
          {albumsOpen ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
        </ListItemButton>
        <Collapse in={albumsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {albumsList}
          </List>
        </Collapse>
      </List>

      <Menu
        open={playlistMenu !== null}
        onClose={handlePlaylistClose}
        anchorReference="anchorPosition"
        anchorPosition={
          playlistMenu !== null
            ? { top: playlistMenu.mouseY, left: playlistMenu.mouseX }
            : undefined
        }
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem onClick={addPlaylist}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faAdd} />
          </ListItemIcon>
          新建歌单
        </MenuItem>
        <MenuItem onClick={deletePlaylist}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faDeleteLeft} />
          </ListItemIcon>
          删除歌单
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default observer(Sidebar);
