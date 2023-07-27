import { useState } from "react";
import {
  Input,
  InputAdornment,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Stack,
} from "@mui/material";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faMagnifyingGlass,
  faMoon,
  faRightFromBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../../store";
import debounce from "../../../utils/debounce";

function Header() {
  const store = useStore();
  // @ts-ignore
  const { userProfile } = useRouteLoaderData("root");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    store.loginStore.setLogin(false);
    localStorage.clear();
    navigate("/login");
  };

  const handleColorMode = () => {
    store.colorModeStore.toggleMode();
    setAnchorEl(null);
  };

  function onChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    if (e.target.value) navigate(`/search/${e.target.value}`);
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        height: "60px",
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "center",
        pr: 4,
        pl: 4,
      }}>
      <Stack direction="row" sx={{ gap: 2 }}>
        <FontAwesomeIcon
          icon={faAngleLeft}
          cursor="pointer"
          onClick={() => navigate(-1)}
        />
        <FontAwesomeIcon
          icon={faAngleRight}
          cursor="pointer"
          onClick={() => navigate(1)}
        />
      </Stack>
      <Input
        placeholder="搜索"
        onChange={debounce(onChange, 1000)}
        endAdornment={
          <InputAdornment position="start">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </InputAdornment>
        }
      />

      <IconButton
        onClick={handleClick}
        title={userProfile?.display_name}
        sx={{
          fontSize: 16,
          gap: 1,
        }}>
        <Avatar src={userProfile?.images[0].url}></Avatar>
      </IconButton>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem onClick={handleColorMode}>
          <ListItemIcon>
            <FontAwesomeIcon
              icon={store.colorModeStore.mode === "light" ? faMoon : faSun}
            />
          </ListItemIcon>
          {store.colorModeStore.mode === "light" ? "深色模式" : "浅色模式"}
        </MenuItem>
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