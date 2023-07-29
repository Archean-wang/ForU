import { observer } from "mobx-react-lite";
import CommonList from "../../components/itemsList/CommonList";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import Loading from "../../components/common/Loading";

function Always() {
  const store = useStore();
  const tracks = store.recentStore.tracks;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    store.recentStore.setRecentTracks();
  }, []);

  function loadNext() {
    setLoading(true);
    store.lovesStore.next().then(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <CommonList
        tracks={tracks}
        title="最近播放"
        loadMore={loadNext}></CommonList>
      {loading && <Loading />}
    </>
  );
}

export default observer(Always);
