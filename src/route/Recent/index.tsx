import { observer } from "mobx-react-lite";
import CommonList from "../../components/itemsList/CommonList";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import Loading from "../../components/common/Loading";
import { useTranslation } from "react-i18next";

function Always() {
  const store = useStore();
  const tracks = store.recentStore.tracks;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
        title={t("recently")}
        loadMore={loadNext}></CommonList>
      {loading && <Loading />}
    </>
  );
}

export default observer(Always);
