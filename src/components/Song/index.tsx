import { Avatar, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { showTime } from "../../utils/formatter";
import { getPlaybackState, startPlayback } from "../../api";
import { InlineArtists } from "../InlineArtists";

function Song({ track, index }: { track: any; index: number }) {
  async function onDoubleClick() {
    const state = await getPlaybackState();
    startPlayback(state.context.uri, track.uri, 0);
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: 60,
        bgcolor: "#f3f2f1",
        alignItems: "center",
        paddingLeft: 2,
        paddingRight: 2,
      }}
      component={"div"}
      onDoubleClick={onDoubleClick}>
      <Typography noWrap={true} sx={{ width: 40 }}>
        {index + 1}
      </Typography>
      <Avatar src={track.album.images[0].url} variant="rounded"></Avatar>
      <Typography sx={{ ml: 2, flex: 1 }} noWrap={true}>
        {track.name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flex: 1,
        }}>
        <InlineArtists artists={track.artists} />
        {/* {showArtists(track.artists)} */}
      </Box>
      <Typography noWrap={true} sx={{ flex: 1, color: "grey" }}>
        <Link to={`/album/${track.album.id}`}>{track.album.name}</Link>
      </Typography>

      <Typography
        noWrap={true}
        width={80}
        align="right"
        sx={{
          color: "grey",
        }}>
        {showTime(track.duration_ms)}
      </Typography>
    </Box>
  );
}

export default Song;
