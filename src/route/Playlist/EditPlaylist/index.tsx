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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>编辑歌单</DialogTitle>
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
                  setErrorMsg("文件格式不正确, 只能上传jpeg格式!");
                } else if (file.size > 256 * 1024) {
                  setErrorMsg("超过256k大小限制!");
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
          label="歌单名"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="description"
          label="描述"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCommit({ imageUrl, name, description })}>
          提交
        </Button>
        <Button onClick={handleClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPlaylist;
