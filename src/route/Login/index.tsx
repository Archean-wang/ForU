import { Box, Button } from "@mui/material";
import { getAuthCode } from "../../utils/authentication";
import { useEffect } from "react";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

function Login() {
  const store = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (store.loginStore.login) navigate("/");
  }, [store.loginStore.login]);

  const handlogin = async () => {
    await getAuthCode();
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
          width: 400,
          height: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
        <img src="/spotify_logo.png" width={200}></img>
        <Button variant="contained" sx={{ width: 100 }} onClick={handlogin}>
          授权登录
        </Button>
      </Box>
    </Box>
  );
}

export default observer(Login);
