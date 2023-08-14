import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import { IpcRendererEvent } from "electron";

function Settings() {
  const store = useStore();
  const [updateInfo, setUpdateInfo] = useState("");

  const handleExit = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.settingsStore.setExitToTray(event.target.value === "true");
  };

  const checkUpdate = () => {
    window.electronAPI.checkUpdate();
  };

  function handleUpdate(_event: IpcRendererEvent, info: string) {
    console.log(info);
    setUpdateInfo(info);
  }

  useEffect(() => {
    window.electronAPI.onUpdatAvailable(handleUpdate);

    return () => {
      window.electronAPI.removeAllListeners("check-update");
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        gap: 2,
      }}>
      <Typography variant="h5" sx={{ alignSelf: "flex-start" }}>
        设置
      </Typography>
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
        <FormControl>
          <FormLabel>退出</FormLabel>
          <RadioGroup
            row
            defaultValue={store.settingsStore.settings?.exitToTray.toString()}
            onChange={handleExit}>
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="退出到托盘"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="直接退出"
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>当前版本</FormLabel>
          <Typography>
            {store.settingsStore.settings.version}
            <Button onClick={checkUpdate}>检查更新</Button>
          </Typography>
          {updateInfo && <Typography>{updateInfo}</Typography>}
        </FormControl>
      </Box>
    </Box>
  );
}

export default Settings;
