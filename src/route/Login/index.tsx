import { Box, Button } from "@mui/material";
import { getAuthCode } from "../../utils/authentication";

function Login() {
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

export default Login;
