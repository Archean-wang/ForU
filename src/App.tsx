import { getAccessToken, getToken } from "./utils/authentication";
import Main from "./components/Main";
import { useStore } from "./store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import Player from "./components/Player";
import { Box } from "@mui/material";

function App() {
  let rt = localStorage.getItem("sp_rt");
  const volumeTmp = localStorage.getItem("volume");
  const store = useStore();
  useEffect(() => {
    if (!store.loginStore.loginStore) {
      if (rt !== null) {
        getToken().then((res) => {
          res && store.loginStore.setLogin(true);
        });
      }
    }
    if (location.pathname.includes("callback")) {
      try {
        const params = location.search.split("?")[1].split("&");
        const code = params[0].split("=")[1];
        const state = params[1].split("=")[1];
        getAccessToken(code);
      } catch (e) {
        console.log(e);
      } finally {
        store.loginStore.setLogin(true);
        location.replace("/");
      }
    }
  }, []);

  async function getAuthCode(cb: Function) {
    let rt = localStorage.getItem("sp_rt");
    if (rt === null) throw Error("asd");
    getToken().then((res) => {
      if (res) {
        const token = localStorage.getItem("sp_tk");
        cb(token);
      } else {
        console.log("error when get token for sdk");
      }
    });
  }

  return (
    <Box sx={{ overflow: "auto" }}>
      <Main />
      {store.loginStore.loginStore && (
        /* @ts-ignore */
        <WebPlaybackSDK
          initialDeviceName={"ForU"}
          getOAuthToken={getAuthCode}
          initialVolume={volumeTmp === null ? 0.5 : parseInt(volumeTmp) / 100}>
          <Player volumeInit={volumeTmp === null ? 50 : parseInt(volumeTmp)} />
        </WebPlaybackSDK>
      )}
    </Box>
  );
}

export default observer(App);
