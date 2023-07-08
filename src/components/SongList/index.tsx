import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { Album, Anchor, Artist, Track } from "../../utils/interface";
import { Link } from "react-router-dom";
import { InlineArtists } from "../InlineArtists";
import { showTime } from "../../utils/formatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { checkTracks, loveTracks, unloveTracks } from "../../api";
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
}: Info) {
  const [menuPos, setMenuPos] = useState<Anchor | null>(null);
  const [idx, setIdx] = useState(-1);
  const [loves, setLoves] = useState(() => items.map((v) => false));
  const store = useStore();

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
        open={menuPos !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPos !== null
            ? { top: menuPos.mouseY, left: menuPos.mouseX }
            : undefined
        }>
        <MenuItem>添加到播放队列</MenuItem>
        <MenuItem>添加到歌单</MenuItem>
      </Menu>
    </TableContainer>
  );
}
