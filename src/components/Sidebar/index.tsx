import { useState } from "react";
import { getAlbums, getArtists, getPlaylists } from "../../api";
import { AlbumIcon, ArtistIcon, PlaylistIcon } from "../../icons";
import {
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Artist, Playlist, SavedAlbum } from "../../utils/interface";

function Sidebar() {
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

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
      {/* <Link to={`/playlist/${pl.id}`}>{pl.name}</Link> */}
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
      {/* <Link to={`/artist/${ar.id}`}>{ar.name}</Link> */}
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
      <ListItemText primary={al.album.name} />
    </ListItemButton>
  ));

  function onClick(n: number) {
    if (n === 0) {
      setPlaylistsOpen(!playlistsOpen);
      if (!playlistsOpen) {
        getPlaylists().then((res) => {
          if (res.items) setPlaylists(res.items);
        });
      }
    } else if (n === 1) {
      setArtistsOpen(!artistsOpen);
      if (!artistsOpen) {
        getArtists().then((res) => {
          if (res.artists.items) setArtists(res.artists.items);
        });
      }
    } else {
      setAlbumsOpen(!albumsOpen);
      if (!albumsOpen) {
        getAlbums().then((res) => {
          if (res.items) setAlbums(res.items);
        });
      }
    }
  }

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 300,
        minWidth: 150,
        overflowY: "auto",
      }}
      component="nav"
      subheader={<ListSubheader component="div">我的音乐库</ListSubheader>}
      dense>
      <ListItemButton onClick={() => onClick(0)}>
        <ListItemIcon
          sx={{
            width: 24,
            height: 24,
          }}>
          <PlaylistIcon />
        </ListItemIcon>
        <ListItemText primary="歌单" />
        {playlistsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={playlistsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {playlistsList}
        </List>
      </Collapse>
      <ListItemButton onClick={() => onClick(1)}>
        <ListItemIcon
          sx={{
            width: 24,
            height: 24,
          }}>
          <ArtistIcon />
        </ListItemIcon>
        <ListItemText primary="歌手" />
        {artistsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={artistsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {artistsList}
        </List>
      </Collapse>
      <ListItemButton onClick={() => onClick(2)}>
        <ListItemIcon
          sx={{
            width: 24,
            height: 24,
          }}>
          <AlbumIcon />
        </ListItemIcon>
        <ListItemText primary="专辑" />
        {albumsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={albumsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {albumsList}
        </List>
      </Collapse>
    </List>
  );
}

export default Sidebar;
