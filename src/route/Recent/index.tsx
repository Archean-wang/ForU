import { observer } from "mobx-react-lite";
import Commonlist from "../../components/itemsList/CommonList";
import { useStore } from "../../store";
import { useEffect } from "react";
import { useCurrentTrack } from "spotify-web-playback-sdk-for-react";

function Always() {
  //@ts-ignore
  const store = useStore();
  const currentTrack = useCurrentTrack();
  const tracks = store.recentStore.recentTracks.items.map((v) => v.track);

  useEffect(() => {
    store.recentStore.setRecentTracks();
  }, [currentTrack]);

  return <Commonlist tracks={tracks} title="最近播放"></Commonlist>;
}

export default observer(Always);
