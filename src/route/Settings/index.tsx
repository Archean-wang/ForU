import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import { IpcRendererEvent } from "electron";
import { ProgressInfo } from "electron-updater";
import { observer } from "mobx-react-lite";

function Settings() {
  const store = useStore();
  const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null);
  const [proxy, setProxy] = useState(store.settingsStore.settings.proxy);
  const [isURLValid, setIsURLValid] = useState(true);

  const handleExit = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.settingsStore.setExitToTray(event.target.value === "true");
  };

  useEffect(() => {
    checkUpdate();
  }, []);

  const checkUpdate = () => {
    window.electronAPI
      .checkUpdate()
      .then((result) => {
        store.settingsStore.setUpdateInfo(result.updateInfo);
      })
      .catch(() => store.globalToastStore.setErrorMessage("检查更新失败"));
  };

  function onDownloadProgress(_event: IpcRendererEvent, info: ProgressInfo) {
    setProgressInfo(info);
  }

  function handleUpdate() {
    window.electronAPI
      .updateDownload()
      .catch(() => store.globalToastStore.setErrorMessage("下载更新失败"));
  }

  function onUpdatDownloaded() {
    window.electronAPI.updateNow();
  }

  function onUpdateError(message?: string) {
    store.globalToastStore.setErrorMessage(message ? message : "更新失败");
  }

  function handleProxy(event: React.ChangeEvent<HTMLInputElement>) {
    setProxy(event.target.value);
    const pattern = /^(https?:\/\/)?([0-9a-zA-Z-]+\.)+([0-9a-zA-Z-]+):\d+$/;
    console.log(pattern.test(event.target.value));
    if (!event.target.value || pattern.test(event.target.value)) {
      store.settingsStore.setProxy(event.target.value);
      setIsURLValid(true);
    } else {
      setIsURLValid(false);
    }
  }

  useEffect(() => {
    window.electronAPI.onDownloadProgress(onDownloadProgress);
    window.electronAPI.onUpdatDownloaded(onUpdatDownloaded);
    window.electronAPI.onUpdateError(onUpdateError);

    return () => {
      window.electronAPI.removeAllListeners("download-progress");
      window.electronAPI.removeAllListeners("update-downloaded");
      window.electronAPI.removeAllListeners("update-error");
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
      }}
    >
      <Typography variant="h5" sx={{ alignSelf: "flex-start" }}>
        设置
      </Typography>
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel>退出</FormLabel>
          <RadioGroup
            row
            defaultValue={store.settingsStore.settings?.exitToTray.toString()}
            onChange={handleExit}
          >
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
          <FormLabel>代理</FormLabel>
          <Input
            type="url"
            value={proxy}
            placeholder="http://host:port(重启生效)"
            onChange={handleProxy}
            error={!isURLValid}
          />
          {!isURLValid && <Typography>"代理无效"</Typography>}
        </FormControl>

        <FormControl>
          <FormLabel>当前版本</FormLabel>
          <Typography>
            <Button onClick={checkUpdate} variant="text">
              {store.settingsStore.settings.version}
            </Button>
          </Typography>

          {store.settingsStore.settings.updateInfo && (
            <>
              <Typography color="red">
                {`发现新版本: ${store.settingsStore.settings.updateInfo.version}`}
                {progressInfo &&
                  `下载进度: ${progressInfo.percent.toFixed(2)}%`}
                <Button onClick={handleUpdate} disabled={Boolean(progressInfo)}>
                  立即更新
                </Button>
              </Typography>
            </>
          )}
        </FormControl>
      </Box>
    </Box>
  );
}

export default observer(Settings);
