import { Box, CircularProgress } from "@mui/material";

function Loading() {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <CircularProgress
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </Box>
  );
}

export default Loading;
