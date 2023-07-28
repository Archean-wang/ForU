import { Box } from "@mui/material";
import { Album } from "../../../utils/interface";
import EntityCard from "../../common/EntityCard";
import debounce from "../../../utils/debounce";

interface AlbumListProps {
  albums: Album[];
  loadMore?: Function;
}

function AlbumList({ albums, loadMore }: AlbumListProps) {
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
      {albums.map((v: Album) => (
        <EntityCard
          key={v.id}
          url={`/album/${v.id}`}
          image={v.images[0].url}
          title={[v.name, v.release_date]}
        />
      ))}
    </Box>
  );
}

export default AlbumList;
