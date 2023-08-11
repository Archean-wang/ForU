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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../../store";

import { Device } from "../../../../utils/interface";
import { transfer } from "../../../../api";
import { observer } from "mobx-react-lite";
import {
  useSpotifyDevice,
  useSpotifyPlayer,
} from "spotify-web-playback-sdk-for-react";

function getVolumeFromLocalStorage(): number {
  let v = localStorage.getItem("volume");
  return v === null ? 50 : parseInt(v);
}

function ExtralControl() {
  const navigate = useNavigate();
  const player = useSpotifyPlayer();
  const store = useStore();
  const [volume, setVolume] = useState(getVolumeFromLocalStorage);
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const open = Boolean(anchorEl);
  const device = useSpotifyDevice();

  useEffect(() => {
    window.electronAPI.onVolumeAdd(onVolumeAdd);
    window.electronAPI.onVolumeSub(onVolumeSub);
    return () => {
      window.electronAPI.removeAllListeners("volume-add");
      window.electronAPI.removeAllListeners("volume-sub");
    };
  }, [player]);

  function onVolumeAdd() {
    player?.getVolume().then((v) => {
      changeVolume(Math.floor(v * 100) + 5);
    });
  }

  function onVolumeSub() {
    player?.getVolume().then((v) => {
      changeVolume(Math.floor(v * 100) - 5);
    });
  }

  const showDevices = (e: React.MouseEvent<SVGSVGElement>) => {
    store.devicesStore.setDevices();
    setAnchorEl(e.currentTarget);
  };

  const volumeIcon = (v: number) => {
    if (v === 0) return faVolumeOff;
    else if (v <= 50) return faVolumeLow;
    return faVolumeHigh;
  };

  function handleVolume(_: Event, value: number | Array<number>) {
    if (typeof value === "number") {
      changeVolume(value);
    }
  }

  function changeVolume(volume: number) {
    volume = volume < 0 ? 0 : volume;
    volume = volume > 100 ? 100 : volume;
    let v = volume / 100;
    player?.setVolume(v).then(() => {
      localStorage.setItem("volume", volume.toString());
      setVolume(volume);
    });
  }

  function mute() {
    if (!device) return;
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

  const handlePlaying = () => {
    if (!device) return;
    navigate("/playing");
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
      <FontAwesomeIcon onClick={handlePlaying} icon={faBars} cursor="pointer" />

      <FontAwesomeIcon icon={faLaptop} cursor="pointer" onClick={showDevices} />
      <FontAwesomeIcon
        icon={volumeIcon(volume)}
        cursor="pointer"
        onClick={mute}
      />

      <Slider
        sx={{
          maxWidth: "4rem",
          ml: 0,
          "& .MuiSlider-thumb": {
            display: "none",
          },
          "&:hover .MuiSlider-thumb": {
            display: "block",
          },
        }}
        size="small"
        disabled={!Boolean(device)}
        valueLabelDisplay="auto"
        value={volume}
        onChange={handleVolume}
      />

      <Menu
        autoFocus={false}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}>
        {store.devicesStore.devices.length === 0 && (
          <MenuItem>暂无设备</MenuItem>
        )}
        {store.devicesStore.devices.map((dev: Device) => (
          <MenuItem
            autoFocus={false}
            onClick={() => handleTransfer(dev.id as string)}
            key={dev.id}
            sx={{ color: dev.is_active ? "primary.main" : "text.primary" }}>
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

export default observer(ExtralControl);
