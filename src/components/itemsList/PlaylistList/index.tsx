import { Box } from "@mui/material";
import { Playlist } from "../../../utils/interface";
import EntityCard from "../../common/EntityCard";
import debounce from "../../../utils/debounce";

interface PlaylistListProps {
  playlists: Playlist[];
  loadMore?: Function;
}

function PlaylistList({ playlists, loadMore }: PlaylistListProps) {
  const deLoadMore = loadMore && debounce(loadMore, 1000);
  return (
    <Box
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
        width: "100%",
        height: "100%",
        gap: 2,
        padding: 2,
        overflow: "auto",
        flexWrap: "wrap",
        display: "flex",
      }}>
      {playlists.map((v: Playlist) => (
        <EntityCard
          key={v.id}
          url={`/playlist/${v.id}`}
          image={v.images[0].url}
          title={[v.name]}
        />
      ))}
    </Box>
  );
}

export default PlaylistList;
