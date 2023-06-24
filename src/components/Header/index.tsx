import { useStore } from "../../store";
import { getUserProfile } from "../../api";
import { useState } from "react";
import { getAuthCode } from "../../utils/authentication";
import {
  Input,
  InputAdornment,
  Avatar,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const store = useStore();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  if (store.loginStore.loginStore) {
    console.log(`login status in header: ${store.loginStore.loginStore}`);
    getUserProfile().then((res) => {
      setAvatarUrl(res.images[0].url);
      setUsername(res.display_name);
    });
  }

  async function login() {
    await getAuthCode();
  }

  function onChange() {
    navigate("/search");
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "60px",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: "20px",
      }}>
      <Input
        placeholder="搜索"
        onChange={onChange}
        startAdornment={
          <InputAdornment position="start">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </InputAdornment>
        }
      />
      {store.loginStore.loginStore ? (
        <Stack direction="row" alignItems="center" gap="4px">
          <Avatar src={avatarUrl}></Avatar>
          <label>{username}</label>
        </Stack>
      ) : (
        <Button onClick={login}>登录</Button>
      )}
    </Box>
  );
}

export default Header;
