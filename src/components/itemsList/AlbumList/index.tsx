import { Box } from "@mui/material";
import { Album } from "../../../utils/interface";
import EntityCard from "../../common/EntityCard";

function AlbumList({ albums }: { albums: Album[] }) {
  return (
    <Box
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
