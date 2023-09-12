import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
  TextField,
  DialogActions,
  Button,
  Alert,
  Collapse,
} from "@mui/material";
import { useRef, useState } from "react";
import { Playlist } from "../../../utils/interface";
import { useTranslation } from "react-i18next";

type HandleEvent = () => void;
type HandleCommit = ({ imageUrl, name, description }: PlaylistDetail) => void;
export interface PlaylistDetail {
  imageUrl: string;
  name: string;
  description: string | null;
}

function EditPlaylist({
  playlist,
  open,
  handleClose,
  handleCommit,
}: {
  playlist: Playlist;
  open: boolean;
  handleClose: HandleEvent;
  handleCommit: HandleCommit;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(
    playlist.images.length !== 0 ? playlist.images[0].url : "/spotify.png"
  );
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [errorMsg, setErrorMsg] = useState("");

  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("edit")}</DialogTitle>
      <DialogContent>
        <Box sx={{ position: "relative", display: "flex", gap: 1 }}>
          <Avatar
            variant="rounded"
            sx={{ cursor: "pointer", width: 64, height: 64 }}
            src={imageUrl}
            onClick={() => {
              const event = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
              });
              fileInput.current?.dispatchEvent(event);
            }}
          />
          <Collapse in={Boolean(errorMsg)}>
            <Alert severity="error">{errorMsg}</Alert>
          </Collapse>
          <input
            onChange={() => {
              const files = fileInput.current?.files;
              if (files?.length) {
                const file = files[0];
                console.log(file);
                if (file.type !== "image/jpeg") {
                  setErrorMsg(t("fileTypeError"));
                } else if (file.size > 256 * 1024) {
                  setErrorMsg(t("fileSizeError"));
                } else {
                  setErrorMsg("");
                  // setImageUrl(URL.createObjectURL(file));
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    console.log(e);
                    setImageUrl(e.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
            ref={fileInput}
            id="playlist_image"
            type="file"
            accept="image/jpeg"
            style={{ opacity: 0, position: "absolute" }}
          />
        </Box>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t("playlistName")}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="description"
          label={t("description")}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCommit({ imageUrl, name, description })}>
          {t("submit")}
        </Button>
        <Button onClick={handleClose}>{t("cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPlaylist;
