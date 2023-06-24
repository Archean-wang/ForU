import Sidebar from "../Sidebar";
import Content from "../Content";
import { Box } from "@mui/material";
function Main() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 80px)",
      }}>
      <Sidebar></Sidebar>
      <Content></Content>
    </Box>
  );
}
export default Main;
