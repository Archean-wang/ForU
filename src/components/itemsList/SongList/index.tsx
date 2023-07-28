import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import {
  Album,
  Anchor,
  Artist,
  Playlist,
  Track,
} from "../../../utils/interface";
import { Link, useRouteLoaderData } from "react-router-dom";
import { InlineArtists } from "../../common/InlineArtists";
import { showTime } from "../../../utils/formatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import {
  addItemsToPlaylist,
  addItemsToQueue,
  checkTracks,
  loveTracks,
  removeItemsFromPlaylist,
  unloveTracks,
} from "../../../api";
import { useStore } from "../../../store";
import EventBus, { MyEvent } from "../../../utils/EventBus";
import SubMenu from "../../common/SubMenu";
import ContextMenu from "../../common/ContextMenu";
import debounce from "../../../utils/debounce";

const Cell = styled(TableCell)(
  ({ theme }) => `
            border: 0;
            max-width: 100px;
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

interface SongListProps {
  items: Track[];
  handDoubleClick: Handler;
  columns?: ColumnDefine[];
  currentPlaylist?: Playlist | undefined;
  hideHead?: boolean;
  fixHeight?: boolean;
  loadMore?: Function;
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
  hideHead = false,
  fixHeight = true,
  loadMore,
}: SongListProps) {
  const [menuPos, setMenuPos] = useState<Anchor | null>(null);
  const [idx, setIdx] = useState(-1);
  const [loves, setLoves] = useState(Array(items.length).fill(false));
  const store = useStore();
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  const deLoadMore = loadMore && debounce(loadMore, 1000);

  useEffect(() => {
    // at most 50 ids once
    const ids = items.map((v) => v.id);
    const slices = [];
    for (let i = 0; i < ids.length; i += 50) {
      slices.push(ids.slice(i, i + 50));
    }
    let result = Promise.all(slices.map((v) => checkTracks(v.join(","))));
    result
      .then((res) => {
        setLoves(res.flat());
      })
      .catch((e) => console.log(e));
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
      <Typography noWrap sx={{ color: "grey", fontSize: "1rem" }}>
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
          fontSize: "1rem",
          color: "grey",
        }}>
        {showTime(duration)}
      </Typography>
    ),
    []
  );

  const fieldRender = (f: string): Render => {
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
      onScroll={
        loadMore
          ? (e) => {
              const el = e.target as HTMLElement;
              if (el.scrollTop + el.offsetHeight > el.scrollHeight - 100)
                deLoadMore && deLoadMore();
            }
          : undefined
      }
      sx={{
        height: fixHeight ? "100%" : "initial",
        width: "100%",
        borderRadius: 2,
      }}>
      <Table padding="normal" size="small">
        {!hideHead && (
          <TableHead sx={{ width: "100%" }}>
            <TableRow>
              <TableCell align="left">#</TableCell>
              {columns.map((v, index) => (
                <TableCell align="left" key={index} sx={{ flex: 1 }}>
                  {v.header}
                </TableCell>
              ))}
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={index}
              hover
              onContextMenu={(e) => {
                e.preventDefault();
                setIdx(index);
                setMenuPos({ mouseX: e.clientX, mouseY: e.clientY });
              }}
              onDoubleClick={(e) => {
                handDoubleClick(index);
                e.preventDefault();
              }}>
              <Cell component="th" scope="row">
                {index + 1}
              </Cell>
              {columns.map((v: ColumnDefine, index) => (
                <Cell component="th" scope="row" key={index}>
                  {v.render
                    ? v.render(item[v.field])
                    : fieldRender(v.field)(item[v.field])}
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

      <ContextMenu onClose={handleClose} anchorPosition={menuPos}>
        <MenuItem onClick={addToQueue} dense>
          下一首播放
        </MenuItem>
        <MenuItem onClick={deleteFromPlaylist} dense>
          从歌单删除
        </MenuItem>

        <SubMenu title="添加到">
          {store.playlistsStore.playlists.items
            .filter((v) => v.owner.id === userProfile.id)
            .map((v) => (
              <MenuItem dense onClick={() => addToPlaylist(v.id)}>
                {v.name}
              </MenuItem>
            ))}
        </SubMenu>
      </ContextMenu>
    </TableContainer>
  );
}
