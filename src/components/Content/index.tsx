import Header from "../Header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function Content() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
      <Header></Header>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}

export default Content;
