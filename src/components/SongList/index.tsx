import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  Typography,
  List,
  Collapse,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { Album, Anchor, Artist, Playlist, Track } from "../../utils/interface";
import { Link, useRouteLoaderData } from "react-router-dom";
import { InlineArtists } from "../InlineArtists";
import { showTime } from "../../utils/formatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  addItemsToPlaylist,
  addItemsToQueue,
  checkTracks,
  loveTracks,
  removeItemsFromPlaylist,
  unloveTracks,
} from "../../api";
import { useStore } from "../../store";
import EventBus, { MyEvent } from "../../utils/EventBus";

const Cell = styled(TableCell)(
  ({ theme }) => `
            border: 0;
            max-width: 200px;
            overflow: hidden;
        `
);

type Render = (args: any) => JSX.Element;

interface ColumnDefine {
  header: string;
  field: "name" | "album" | "artists" | "duration_ms";
  render?: Render;
}

type Handler = (v: number) => any;

interface Info {
  items: Track[];
  handDoubleClick: Handler;
  columns?: ColumnDefine[];
  currentPlaylist?: Playlist | undefined;
}

const defaultColumns = [
  {
    header: "歌名",
    field: "name",
  },
  {
    header: "歌手",
    field: "artists",
  },
  {
    header: "专辑",
    field: "album",
  },
  {
    header: "时长",
    field: "duration_ms",
  },
] as ColumnDefine[];

export default function SongList({
  items,
  columns = defaultColumns,
  handDoubleClick,
  currentPlaylist = undefined,
}: Info) {
  const [menuPos, setMenuPos] = useState<Anchor | null>(null);
  const [idx, setIdx] = useState(-1);
  const [loves, setLoves] = useState(() => items.map((v) => false));
  const store = useStore();
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");

  const [playlistsOpen, setPlaylistOpen] = useState(false);

  useEffect(() => {
    checkTracks(items.map((v) => v.id).join(",")).then((res) => {
      setLoves(res);
    });
  }, [items]);

  useEffect(() => {
    const handle = (e: MyEvent) => {
      items.forEach((track, index) => {
        if (track.id === e.id) {
          let tmp = [...loves];
          tmp[index] = e.value;
          setLoves(tmp);
        }
      });
    };
    EventBus.addHandle("loveTrack", handle);

    return () => {
      EventBus.removeHandle("loveTrack", handle);
    };
  }, [loves]);

  function handleClose() {
    setMenuPos(null);
    setPlaylistOpen(false);
  }

  const commonRender = useCallback(
    (v: string) => <Typography noWrap>{v}</Typography>,
    []
  );
  const artistRender = useCallback(
    (artists: Artist[]) => <InlineArtists artists={artists} />,
    []
  );

  const albumRender = useCallback(
    (album: Album) => (
      <Typography noWrap sx={{ color: "grey", fontSize: 14 }}>
        <Link to={`/album/${album.id}`}>{album.name}</Link>
      </Typography>
    ),
    []
  );

  const durationRender = useCallback(
    (duration: number) => (
      <Typography
        noWrap={true}
        width={80}
        sx={{
          color: "grey",
        }}>
        {showTime(duration)}
      </Typography>
    ),
    []
  );

  const filedRender = (f: string): Render => {
    switch (f) {
      case "artists":
        return artistRender;
      case "album":
        return albumRender;
      case "duration_ms":
        return durationRender;
      default:
        return commonRender;
    }
  };

  function toggleLove(index: number) {
    if (loves[index]) {
      unloveTracks(items[index].id).then(() => {
        store.lovesStore.setLoves();
        EventBus.trigger({
          name: "loveTrack",
          id: items[index].id,
          value: false,
        });
      });
    } else {
      loveTracks(items[index].id).then(() => {
        store.lovesStore.setLoves();
        EventBus.trigger({
          name: "loveTrack",
          id: items[index].id,
          value: true,
        });
      });
    }
  }

  function addToQueue() {
    addItemsToQueue(items[idx].uri).then(() => {
      console.log("add to queue");
    });
    setMenuPos(null);
  }

  function addToPlaylist(pid: string) {
    addItemsToPlaylist(pid, [items[idx].uri]).then(() => {});
    setMenuPos(null);
  }

  function deleteFromPlaylist() {
    currentPlaylist &&
      removeItemsFromPlaylist(
        currentPlaylist?.id,
        [items[idx].uri],
        currentPlaylist?.snapshot_id
      ).then(() => {
        EventBus.trigger({
          name: "playlist",
          action: "delete",
          uri: items[idx].uri,
        });
      });
    setMenuPos(null);
  }

  return (
    <TableContainer
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 2,
        overflow: "auto",
      }}>
      <Table padding="normal" size="small">
        <TableHead sx={{ width: "100%" }}>
          <TableRow>
            <TableCell align="left">#</TableCell>
            {columns.map((v, index) => (
              <TableCell align="left" key={index} sx={{ flex: 1 }}>
                {v.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              hover
              onContextMenu={(e) => {
                setIdx(index);
                setMenuPos({ mouseX: e.clientX, mouseY: e.clientY });
              }}
              onDoubleClick={() => handDoubleClick(index)}>
              <Cell component="th" scope="row">
                {index + 1}
              </Cell>
              {columns.map((v: ColumnDefine, index) => (
                <Cell component="th" scope="row" key={index}>
                  {v.render
                    ? v.render(item[v.field])
                    : filedRender(v.field)(item[v.field])}
                </Cell>
              ))}
              <Cell
                onClick={() => toggleLove(index)}
                component="th"
                scope="row"
                sx={{
                  color: loves[index] ? "primary.main" : "secondary.main",
                }}>
                <FontAwesomeIcon icon={faHeart} cursor="pointer" />
              </Cell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu
        slotProps={{ paper: { style: { maxHeight: 200 } } }}
        open={menuPos !== null}
        onClose={handleClose}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPos !== null
            ? { top: menuPos.mouseY, left: menuPos.mouseX }
            : undefined
        }>
        <List dense>
          <ListItemButton dense onClick={addToQueue}>
            <ListItemText primary="下一首播放" />
          </ListItemButton>
          {currentPlaylist !== undefined && (
            <ListItemButton dense onClick={deleteFromPlaylist}>
              <ListItemText primary="从歌单删除" sx={{ pr: 2 }} />
            </ListItemButton>
          )}
          <ListItemButton dense onClick={() => setPlaylistOpen(!playlistsOpen)}>
            <ListItemText primary="添加到歌单" sx={{ pr: 2 }} />
            {playlistsOpen ? (
              <FontAwesomeIcon icon={faAngleUp} />
            ) : (
              <FontAwesomeIcon icon={faAngleDown} />
            )}
          </ListItemButton>
          <Collapse in={playlistsOpen}>
            <List dense>
              {store.playlistsStore.playlists.items
                .filter((v) => v.owner.id === userProfile.id)
                .map((v) => (
                  <ListItemButton
                    dense
                    sx={{ pl: 4 }}
                    onClick={() => addToPlaylist(v.id)}>
                    <ListItemText>{v.name}</ListItemText>
                  </ListItemButton>
                ))}
            </List>
          </Collapse>
        </List>
      </Menu>
    </TableContainer>
  );
}
