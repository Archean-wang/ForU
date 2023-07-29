import { useState } from "react";
import Commonlist from "../../components/itemsList/CommonList";
import { useStore } from "../../store";
import { Typography } from "@mui/material";

function Always() {
  const store = useStore();
  const [loading, setLoading] = useState(false);

  function loadNext() {
    setLoading(true);
    store.topItemsStore.nextTopTracks().then(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <Commonlist
        tracks={store.topItemsStore.tracks}
        loadMore={loadNext}
        title="最多播放"></Commonlist>
      {loading && <Typography height="1.5rem">加载中...</Typography>}
    </>
  );
}

export default Always;
