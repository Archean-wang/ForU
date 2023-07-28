import { Box } from "@mui/material";
import { Artist } from "../../../utils/interface";
import EntityCard from "../../common/EntityCard";

interface ArtistListProps {
  artists: Artist[];
  wrap?: "wrap" | "nowrap"; // nowrap 用于单行显示歌手
}

function ArtistList({ artists, wrap = "wrap" }: ArtistListProps) {
  return (
    <Box
      onWheel={(e) => {
        if (wrap === "nowrap") {
          e.currentTarget.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }}
      sx={{
        width: "100%",
        height: wrap == "wrap" ? "100%" : "initial",
        gap: 2,
        padding: wrap == "wrap" ? 2 : 0,
        overflowX: "hidden",
        flexWrap: wrap,
        display: "flex",
      }}>
      {artists.map((v: Artist) => (
        <EntityCard
          key={v.id}
          url={`/artist/${v.id}`}
          image={v.images.length !== 0 ? v.images[0].url : "/spotify.png"}
          title={[v.name]}
        />
      ))}
    </Box>
  );
}

export default ArtistList;
