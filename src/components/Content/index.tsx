import Header from "../Header";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigation } from "react-router-dom";

function Content() {
  const navigation = useNavigation();
  return (
    <Box
      sx={{
        flex: 1,
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
        {navigation.state === "loading" ? (
          <CircularProgress
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : (
          <Outlet></Outlet>
        )}
      </Box>
    </Box>
  );
}

export default Content;
