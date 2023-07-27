import { Avatar, Box, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Artist } from "../../../utils/interface";

// wrap 用于单行显示歌手
function ArtistList({
  artists,
  wrap = "wrap",
}: {
  artists: Artist[];
  wrap?: string;
}) {
  const navigate = useNavigate();
  return (
    <Box
      onWheel={(e) => {
        e.currentTarget.scrollLeft += e.deltaY;
      }}
      sx={{
        width: "100%",
        height: wrap == "wrap" ? "100%" : "initial",
        gap: 4,
        padding: wrap == "wrap" ? 2 : 0,
        overflowX: "hidden",
        flexWrap: wrap,
        display: "flex",
      }}>
      {artists.map((v: Artist) => (
        <Box
          onClick={() => navigate(`/artist/${v.id}`)}
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
            src={v.images.length !== 0 ? v.images[0].url : "/spotify.png"}
            sx={{ width: 140, height: 140, alignSelf: "center" }}
          />
          <Typography
            noWrap
            fontSize={10}
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {v.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default ArtistList;
