import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Snackbar,
} from "@mui/material";
import { getAccessToken, getAuthCode } from "../../utils/authentication";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import logoURL from "../../assets/spotify_logo.png";
import debounce from "../../utils/debounce";

function Login() {
  const store = useStore();
  const navigate = useNavigate();
  const [clientID, setClientID] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.electronAPI.getSetting("client_id").then((id) => {
      setClientID(id);
      localStorage.setItem("client_id", id);
    });
  }, []);

  useEffect(() => {
    if (store.loginStore.login) navigate("/");
  }, [store.loginStore.login]);

  useEffect(() => {
    window.electronAPI.onCodeReady((_event, code) => {
      getAccessToken(code).then(() => {
        store.loginStore.setLogin(true);
      });
    });
    return () => {
      window.electronAPI.removeAllListeners("onCodeReady");
    };
  }, []);

  const handleClientID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientID(event.target.value);
    localStorage.setItem("client_id", event.target.value);
    window.electronAPI.setSettings("client_id", event.target.value);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handlogin = async () => {
    if (!clientID) {
      setOpen(true);
    } else {
      const url = await getAuthCode(clientID);
      window.electronAPI.openURL(url);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}>
        <img src={logoURL} width={240} />
        <FormControl sx={{ width: "60%", mt: 4 }}>
          <FormLabel>Client ID</FormLabel>
          <Input value={clientID} onChange={debounce(handleClientID, 300)} />
        </FormControl>
        <Button variant="contained" sx={{ width: 100 }} onClick={handlogin}>
          授权登录
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message="Empty client id!"
        />
      </Box>
    </Box>
  );
}

export default observer(Login);
