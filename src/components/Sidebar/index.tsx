import { useState } from "react";
import {
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Collapse,
  Box,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { Artist, Playlist, SavedAlbum } from "../../utils/interface";
import {
  faAngleDown,
  faAngleUp,
  faCompactDisc,
  faHeadphonesSimple,
  faHeart,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  // @ts-ignore
  const { playlistsRes, artistsRes, albumsRes } = useRouteLoaderData("root");
  const playlists = playlistsRes.items;
  const artists = artistsRes.artists.items;
  const albums = albumsRes.items;

  const [playlistsOpen, setPlaylistsOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const [albumsOpen, setAlbumsOpen] = useState(false);

  const navigate = useNavigate();

  const playlistsList = playlists.map((pl: Playlist) => (
    <ListItemButton
      sx={{ pl: 4 }}
      key={pl.id}
      onClick={() => navigate(`/playlist/${pl.id}`)}>
      <ListItemIcon>
        <Avatar src={pl.images[0].url} variant="rounded" />
      </ListItemIcon>
      <ListItemText primary={pl.name} />
    </ListItemButton>
  ));

  const artistsList = artists.map((ar: Artist) => (
    <ListItemButton
      sx={{ pl: 4 }}
      key={ar.id}
      onClick={() => navigate(`/artist/${ar.id}`)}>
      <ListItemIcon>
        <Avatar src={ar.images[0].url} variant="rounded" />
      </ListItemIcon>
      <ListItemText primary={ar.name} />
    </ListItemButton>
  ));

  const albumsList = albums.map((al: SavedAlbum) => (
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
        sx={{ flexWrap: "nowrap" }}
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
        <ListItemButton onClick={() => navigate("/daily")}>
          <ListItemIcon
            sx={{
              alignItems: "center",
            }}>
            <FontAwesomeIcon icon={faHouse} />
          </ListItemIcon>
          <ListItemText primary="主页" />
        </ListItemButton>
        <ListItemButton divider onClick={() => navigate("/loved")}>
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
    </Box>
  );
}

export default Sidebar;
