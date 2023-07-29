import { useState } from "react";
import Commonlist from "../../components/itemsList/CommonList";
import { useStore } from "../../store";
import Loading from "../../components/common/Loading";

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
      {loading && <Loading />}
    </>
  );
}

export default Always;
