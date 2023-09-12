import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import { IpcRendererEvent } from "electron";
import { ProgressInfo } from "electron-updater";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

function Settings() {
  const store = useStore();
  const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null);
  const [proxy, setProxy] = useState(store.settingsStore.settings.proxy);
  const [isURLValid, setIsURLValid] = useState(true);
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(store.settingsStore.settings.language);

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
        store.settingsStore.setUpdateInfo(result);
      })
      .catch(() =>
        store.globalToastStore.setErrorMessage(t("checkUpdateFailedMsg"))
      );
  };

  function onDownloadProgress(_event: IpcRendererEvent, info: ProgressInfo) {
    setProgressInfo(info);
  }

  function handleUpdate() {
    window.electronAPI
      .updateDownload()
      .catch(() =>
        store.globalToastStore.setErrorMessage(t("downloadUpdateFailedMsg"))
      );
  }

  function onUpdatDownloaded() {
    window.electronAPI.updateNow();
  }

  function onUpdateError(message?: string) {
    store.globalToastStore.setErrorMessage(
      message ? message : t("updateFailedMsg")
    );
  }

  function handleProxy(event: React.ChangeEvent<HTMLInputElement>) {
    setProxy(event.target.value);
    const pattern = /^(https?:\/\/)?([0-9a-zA-Z-]+\.)+([0-9a-zA-Z-]+):\d+$/;
    if (!event.target.value || pattern.test(event.target.value)) {
      store.settingsStore.setProxy(event.target.value);
      setIsURLValid(true);
    } else {
      setIsURLValid(false);
    }
  }

  function handleLanguage(event: SelectChangeEvent<string>) {
    i18n.changeLanguage(event.target.value);
    setLang(event.target.value);
    window.electronAPI.setSettings("language", event.target.value);
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
      }}>
      <Typography variant="h5" sx={{ alignSelf: "flex-start" }}>
        {t("settings")}
      </Typography>
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
        <FormControl>
          <FormLabel>{t("exit")}</FormLabel>
          <RadioGroup
            row
            defaultValue={store.settingsStore.settings?.exitToTray.toString()}
            onChange={handleExit}>
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={t("exitToTray")}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label={t("exit")}
            />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>{t("language")}</FormLabel>
          <Select value={lang} onChange={handleLanguage}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="zh">简体中文</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>{t("proxy")}</FormLabel>
          <Input
            type="url"
            value={proxy}
            placeholder={`http://host:port(${t("needRestart")})`}
            onChange={handleProxy}
            error={!isURLValid}
          />
          {!isURLValid && <Typography>{t("proxyInvalid")}</Typography>}
        </FormControl>

        <FormControl>
          <FormLabel>{t("currentVersion")}</FormLabel>
          <Typography>
            <Button onClick={checkUpdate} variant="text">
              {store.settingsStore.settings.version}
            </Button>
          </Typography>

          {store.settingsStore.updateAvailable ? (
            <>
              <Typography color="red">
                {`${t("findNewVersion")}: ${
                  store.settingsStore.settings.updateCheckResult?.updateInfo
                    .version
                }`}
                {progressInfo &&
                  ` | ${t("progress")}: ${progressInfo.percent.toFixed(2)}%`}
                <Button onClick={handleUpdate} disabled={Boolean(progressInfo)}>
                  {t("updateNow")}
                </Button>
              </Typography>
            </>
          ) : (
            <Typography sx={{ color: "primary.main" }}>
              {t("alreadyLatest")}
            </Typography>
          )}
        </FormControl>
      </Box>
    </Box>
  );
}

export default observer(Settings);
