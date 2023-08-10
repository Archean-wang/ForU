import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useStore } from "../../store";

function Settings() {
  const store = useStore();

  const handleExit = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.settingsStore.setExitToTray(event.target.value === "true");
  };

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
      </Box>
    </Box>
  );
}

export default Settings;
