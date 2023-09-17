import { getToken } from "./utils/authentication";

import { useStore } from "./store";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

import Player from "./components/frame/Player";
import { Box, ThemeProvider, createTheme } from "@mui/material";

import { grey } from "@mui/material/colors";
import { SpotifyWebSDK } from "spotify-web-playback-sdk-for-react";
import Main from "./components/frame/Main";
import GlobalToast from "./components/common/GlobalToast";

import "./i18n";
import useAutoLogin from "./hooks/useAutologin.ts";

function App() {
  const volume = localStorage.getItem("volume");
  const store = useStore();
  const login = useAutoLogin();

  const getAuthCode = useCallback(async function (cb: Function) {
    const token = await getToken();
    cb(token);
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

  return login ? (
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
          volume={volume === null ? 0.5 : parseInt(volume) / 100}
          enableMediaSession={true}>
          <Main />
          <Player />
          <GlobalToast />
        </SpotifyWebSDK>
      </Box>
    </ThemeProvider>
  ) : (
    <></>
  );
}

export default observer(App);
