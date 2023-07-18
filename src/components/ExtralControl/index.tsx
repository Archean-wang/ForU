import {
  faBars,
  faDesktop,
  faLaptop,
  faMobilePhone,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ListItemIcon, Menu, MenuItem, Slider } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import {
  usePlayerDevice,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import { Device } from "../../utils/interface";
import { transfer } from "../../api";

function getVolumeFromLocalStorage(): number {
  let v = localStorage.getItem("volume");
  return v === null ? 50 : parseInt(v);
}

function ExtralControl() {
  const navigate = useNavigate();
  const device = usePlayerDevice();
  const player = useSpotifyPlayer();
  const store = useStore();
  const [volume, setVolume] = useState(getVolumeFromLocalStorage);
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const open = Boolean(anchorEl);

  console.log("extra render");

  const showDevices = (e: React.MouseEvent<SVGSVGElement>) => {
    store.devicesStore.setDevices();
    setAnchorEl(e.currentTarget);
  };

  const volumeIcon = (v: number) => {
    if (v === 0) return faVolumeOff;
    else if (v <= 50) return faVolumeLow;
    return faVolumeHigh;
  };

  function changeVolume(_: Event, value: number | Array<number>) {
    if (typeof value === "number") {
      const v = value / 100;
      player?.setVolume(v).then(() => {
        localStorage.setItem("volume", value.toString());
        setVolume(value);
      });
    }
  }

  function mute() {
    if (volume === 0) {
      let v = getVolumeFromLocalStorage();
      player?.setVolume(v / 100).then(() => {
        setVolume(v);
      });
    } else {
      player?.setVolume(0).then(() => {
        setVolume(0);
      });
    }
  }

  const handleTransfer = (id: string) => {
    transfer(id);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        pr: 4,
        height: "100%",
        alignItems: "center",
        gap: 2,
      }}>
      <FontAwesomeIcon
        onClick={() => navigate("/playing")}
        icon={faBars}
        cursor="pointer"
      />

      <FontAwesomeIcon icon={faLaptop} cursor="pointer" onClick={showDevices} />
      <FontAwesomeIcon
        icon={volumeIcon(volume)}
        cursor="pointer"
        onClick={mute}
      />

      <Slider
        sx={{
          marginLeft: "8px",
          maxWidth: 80,
          ml: 0,
          "& .MuiSlider-thumb": {
            display: "none",
          },
          "&:hover .MuiSlider-thumb": {
            display: "block",
          },
        }}
        size="small"
        valueLabelDisplay="auto"
        value={volume}
        disabled={device?.status !== "ready"}
        onChange={changeVolume}
      />

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}>
        {store.devicesStore.devices.map((dev: Device) => (
          <MenuItem
            onClick={() => handleTransfer(dev.id)}
            key={dev.id}
            sx={{ color: dev.is_active ? "green" : "text.primary" }}>
            <ListItemIcon>
              <FontAwesomeIcon
                icon={dev.type === "Computer" ? faDesktop : faMobilePhone}
              />
            </ListItemIcon>
            {dev.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default ExtralControl;
