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
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { Anchor, Artist, Playlist, SavedAlbum } from "../../utils/interface";
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faCompactDisc,
  faDeleteLeft,
  faHeadphonesSimple,
  faHeart,
  faHeartBroken,
  faHouse,
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

function Sidebar() {
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  const store = useStore();
  const device = usePlayerDevice();

  const [playlistsOpen, setPlaylistsOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const [albumsOpen, setAlbumsOpen] = useState(false);

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
      setPlaylistMenu(null);
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
        console.warn(
          "对于自己创建的歌单并未真正删除，只是不在音乐库中，可以搜到"
        );
      }
    );

    setPlaylistMenu(null);
  }

  const playlistsList = store.playlistsStore.playlists.items.map(
    (pl: Playlist, index: number) => (
      <ListItemButton
        onContextMenu={(e) => {
          setPlaylistIdx(index);
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
        <ListItemText
          primary={pl.name}
          title={pl.name}
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        />
      </ListItemButton>
    )
  );

  const artistsList = store.artistsStore.artists.artists.items.map(
    (ar: Artist, index: number) => (
      <ListItemButton
        onContextMenu={(e) => {
          setArtistIdx(index);
          e.preventDefault();
          setArtistMenu(
            artistMenu === null
              ? {
                  mouseX: e.clientX + 2,
                  mouseY: e.clientY - 6,
                }
              : null
          );
        }}
        sx={{ pl: 4 }}
        key={ar.id}
        onClick={() => navigate(`/artist/${ar.id}`)}>
        <ListItemIcon>
          <Avatar src={ar.images[0].url} variant="rounded" />
        </ListItemIcon>
        <ListItemText
          primary={ar.name}
          title={ar.name}
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        />
      </ListItemButton>
    )
  );

  const albumsList = store.albumsStore.albums.items.map(
    (al: SavedAlbum, index: number) => (
      <ListItemButton
        onContextMenu={(e) => {
          setAlbumIdx(index);
          e.preventDefault();
          setAlbumMenu(
            albumMenu === null
              ? {
                  mouseX: e.clientX + 2,
                  mouseY: e.clientY - 6,
                }
              : null
          );
        }}
        sx={{ pl: 4 }}
        key={al.album.id}
        onClick={() => navigate(`/album/${al.album.id}`)}>
        <ListItemIcon>
          <Avatar src={al.album.images[0].url} variant="rounded" />
        </ListItemIcon>
        <ListItemText
          primary={al.album.name}
          title={al.album.name}
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        />
      </ListItemButton>
    )
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 240,
        minWidth: 240,
        overflowY: "auto",
        overflowX: "hidden",
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
        subheader={
          <ListSubheader
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography>我的音乐库</Typography>
            <FontAwesomeIcon
              icon={faAdd}
              cursor="pointer"
              onClick={addPlaylist}
            />
          </ListSubheader>
        }
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
        }>
        <MenuItem onClick={playPlaylist}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faPlayCircle} />
          </ListItemIcon>
          播放
        </MenuItem>
        <MenuItem onClick={deletePlaylist}>
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
        <MenuItem onClick={startArtist}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faPlayCircle} />
          </ListItemIcon>
          播放
        </MenuItem>
        <MenuItem onClick={unfollowArtist}>
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
        <MenuItem onClick={startAlbum}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faPlayCircle} />
          </ListItemIcon>
          播放
        </MenuItem>
        <MenuItem
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
