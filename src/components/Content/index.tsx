import Header from "../Header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function Content() {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 400,
        overflow: "auto",
        height: "100%",
      }}>
      <Header></Header>
      <Box
        sx={{
          width: "100%",
          padding: 4,
          height: "calc(100% - 60px)",
          overflow: "hidden",
        }}>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}

export default Content;
