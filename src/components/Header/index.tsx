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
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../store";

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
        onChange={onChange}
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
