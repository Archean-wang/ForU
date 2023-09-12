import { Avatar, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface InfoCardProps {
  image?: string | undefined;
  title: string;
  children: React.ReactNode;
  type: string;
}

function InfoCard({ image, title, type, children }: InfoCardProps) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        height: "14rem",
        display: "flex",
        alignItems: "center",
        overflowX: "auto",
        gap: 2,
        mb: 2,
      }}>
      <Avatar
        src={image ? image : "/spotify.png"}
        variant="rounded"
        sx={{ width: "12rem", height: "12rem" }}
      />

      <Box
        sx={{
          flex: 4,
          display: "flex",
          height: "12rem",
          flexDirection: "column",
          gap: 1,
          justifyContent: "flex-start",
          overflow: "hidden",
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflow: "hidden",
          }}>
          <Typography
            sx={{
              minWidth: "2.4rem",
              padding: 0.5,
              lineHeight: "1.2rem",
              bgcolor: "primary.main",
              borderRadius: 1,
              fontSize: "1rem",
            }}>
            {t(type)}
          </Typography>
          <Typography fontSize={"2rem"} noWrap>
            {title}
          </Typography>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default InfoCard;
