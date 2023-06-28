import { Avatar, Box, Typography } from "@mui/material";
import { Artist } from "../../utils/interface";
import { useNavigate } from "react-router-dom";

function ArtistList({ artists }: { artists: Artist[] }) {
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
