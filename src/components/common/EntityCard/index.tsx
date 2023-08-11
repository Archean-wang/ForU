import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface EntityCardProps {
  url: string;
  image: string;
  title: string[];
}

function EntityCard({ url, image, title }: EntityCardProps) {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate(url)}
      sx={{
        width: "10rem",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        gap: 1,
        padding: "0.5rem",
      }}>
      <Avatar
        variant="rounded"
        src={image}
        sx={{ width: "9rem", height: "9rem", alignSelf: "center" }}
      />
      {title.map((t) => (
        <Typography
          key={t}
          noWrap
          fontSize={"1rem"}
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {t}
        </Typography>
      ))}
    </Box>
  );
}

export default EntityCard;
