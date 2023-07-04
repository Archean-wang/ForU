import { useLoaderData } from "react-router-dom";
import Song from "../../components/Song";
import { Box, Typography } from "@mui/material";

function Playing() {
  //@ts-ignore
  const { playingList } = useLoaderData();
  const songs = playingList?.queue.map((track: any, index: number) => (
    <Song track={track} index={index} key={track.id} />
  ));
  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        margin: 2,
        padding: 2,
      }}
      component={"div"}>
      <Typography sx={{ fontWeight: "bold", fontSize: 20, color: "gray" }}>
        当前播放
      </Typography>
      {playingList?.currently_playing !== null && (
        <Song track={playingList?.currently_playing} index={0} />
      )}
      <Typography
        sx={{ fontWeight: "bold", fontSize: 20, color: "gray", mt: 2 }}>
        即将播放
      </Typography>
      <Box component={"div"}>{songs}</Box>
    </Box>
  );
}

export default Playing;
