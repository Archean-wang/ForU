import { Avatar, Box, Typography } from "@mui/material";

export interface InfoCardProps {
  image?: string | undefined;
  title: string;
  children: React.ReactNode;
  type: string;
}

const types = new Map([
  ["artist", "歌手"],
  ["album", "专辑"],
  ["playlist", "歌单"],
]);

function InfoCard({ image, title, type, children }: InfoCardProps) {
  return (
    <Box
      sx={{
        height: 160,
        display: "flex",
        alignItems: "center",
        overflowX: "auto",
        gap: 2,
        mb: 2,
      }}>
      <Avatar
        src={image ? image : "spotify.png"}
        variant="rounded"
        sx={{ width: 120, height: 120 }}
      />

      <Box
        sx={{
          flex: 4,
          display: "flex",
          height: "100%",
          flexDirection: "column",
          gap: 1,
          justifyContent: "flex-end",
        }}>
        <Typography>{types.get(type)}</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography fontSize={32}>{title}</Typography>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default InfoCard;
