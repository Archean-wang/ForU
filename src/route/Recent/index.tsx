import { observer } from "mobx-react-lite";
import Commonlist from "../../components/CommonList";
import { useStore } from "../../store";
import { usePlaybackState } from "react-spotify-web-playback-sdk";
import { useEffect } from "react";

function Always() {
  //@ts-ignore
  const store = useStore();
  const playbackState = usePlaybackState();
  const tracks = store.recentStore.recentTracks.items.map((v) => v.track);

  useEffect(() => {
    store.recentStore.setRecentTracks();
  }, [playbackState?.track_window.current_track]);
  return <Commonlist tracks={tracks} title="最近播放"></Commonlist>;
}

export default observer(Always);
