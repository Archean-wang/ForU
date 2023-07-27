import { getToken } from "./utils/authentication";

import { useStore } from "./store";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";

import Player from "./components/frame/Player";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { SpotifyWebSDK } from "spotify-web-playback-sdk-for-react";
import Main from "./components/frame/Main";

function App() {
  let rt = localStorage.getItem("sp_rt");
  const volume = localStorage.getItem("volume");
  const store = useStore();
  const navigate = useNavigate();

  console.log(store.loginStore.login);

  useEffect(() => {
    if (!store.loginStore.login) {
      if (rt !== null) {
        getToken()
          .then((res) => {
            res && store.loginStore.setLogin(true);
          })
          .catch(() => {
            navigate("/login");
          });
      } else {
        navigate("/login");
      }
    }
  }, []);

  const getAuthCode = useCallback(async function (cb: Function) {
    getToken().then((res) => {
      if (res) {
        const token = localStorage.getItem("sp_tk");
        cb(token);
      } else {
        console.log("error when get token for sdk");
      }
    });
  }, []);

  const theme = createTheme({
    palette: {
      mode: store.colorModeStore.mode,
      ...(store.colorModeStore.mode === "light"
        ? {
            primary: {
              main: "#1DB954",
            },
            success: {
              main: "#1DB954",
            },
            secondary: grey,
            popover: "#fff",
          }
        : {
            background: {
              paper: "#191414",
              default: grey[900],
            },
            primary: {
              main: "#1DB954",
            },
            success: {
              main: "#1DB954",
            },
            secondary: grey,
            popover: grey[800],
          }),
    },
  });

  return store.loginStore.login ? (
    <ThemeProvider theme={theme}>
      <Box
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        sx={{
          overflow: "hidden",
          bgcolor: "background.paper",
          color: "text.primary",
        }}>
        <SpotifyWebSDK
          name={"ForU"}
          getOAuthToken={getAuthCode}
          volume={volume === null ? 0.5 : parseInt(volume) / 100}>
          <Main />
          <Player />
        </SpotifyWebSDK>
      </Box>
    </ThemeProvider>
  ) : (
    <></>
  );
}

export default observer(App);
