import { useStore } from "../../store";
import { getUserProfile } from "../../api";
import { useEffect, useState } from "react";
import {
  Input,
  InputAdornment,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const store = useStore();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    getProfile();
  }, [store.loginStore.loginStore]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getProfile = () => {
    getUserProfile().then((res) => {
      setAvatarUrl(res.images[0].url);
      setUsername(res.display_name);
    });
  };

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

      <IconButton
        onClick={handleClick}
        title={username}
        sx={{
          fontSize: 16,
          gap: 1,
        }}>
        <Avatar src={avatarUrl}></Avatar>
      </IconButton>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </ListItemIcon>
          退出
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Header;
