import { Avatar, Box, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Playlist } from "../../../utils/interface";

function PlaylistList({ playlists }: { playlists: Playlist[] }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        gap: 4,
        padding: 4,
        overflow: "auto",
        flexWrap: "wrap",
        display: "flex",
      }}>
      {playlists.map((v: Playlist) => (
        <Box
          onClick={() => navigate(`/playlist/${v.id}`)}
          key={v.id}
          sx={{
            height: 200,
            width: 160,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            gap: 1,
            padding: 1,
          }}>
          <Avatar
            variant="rounded"
            src={v.images[0].url}
            sx={{ width: 140, height: 140, alignSelf: "center" }}
          />
          <Typography
            noWrap
            fontSize="1rem"
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {v.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default PlaylistList;
