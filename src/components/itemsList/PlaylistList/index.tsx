import { Avatar, Box, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Playlist } from "../../../utils/interface";
import EntityCard from "../../common/EntityCard";

function PlaylistList({ playlists }: { playlists: Playlist[] }) {
  const navigate = useNavigate();
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
