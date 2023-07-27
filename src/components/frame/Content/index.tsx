import Header from "../Header";
import { Box } from "@mui/material";
import { Outlet, useNavigation } from "react-router-dom";
import Loading from "../../common/Loading";

function Content() {
  const navigation = useNavigation();
  return (
    <Box
      sx={{
        borderLeft: "solid 12px",
        borderLeftColor: "divider",
        flex: 16,
        minWidth: 400,
        height: "100%",
      }}>
      <Header></Header>
      <Box
        sx={{
          width: "100%",
          padding: 4,
          height: "calc(100% - 60px)",
          position: "relative",
        }}>
        {navigation.state === "loading" ? <Loading /> : <Outlet></Outlet>}
      </Box>
    </Box>
  );
}

export default Content;
