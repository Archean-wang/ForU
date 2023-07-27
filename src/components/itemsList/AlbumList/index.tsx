import { Avatar, Box, Typography } from "@mui/material";
import { Album } from "../../../utils/interface";
import { useNavigate } from "react-router-dom";

function AlbumList({ albums }: { albums: Album[] }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        gap: 4,
        padding: 2,
        overflow: "auto",
        flexWrap: "wrap",
        display: "flex",
      }}>
      {albums.map((v: Album) => (
        <Box
          onClick={() => navigate(`/album/${v.id}`)}
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
            fontSize={10}
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {v.name}
          </Typography>
          <Typography
            noWrap
            fontSize={10}
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {v.release_date}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default AlbumList;
