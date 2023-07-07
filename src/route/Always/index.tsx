import Commonlist from "../../components/CommonList";
import { useStore } from "../../store";

function Always() {
  //@ts-ignore
  const store = useStore();
  return (
    <Commonlist
      tracks={store.topItemsStore.topTracks.items}
      title="最多播放"></Commonlist>
  );
}

export default Always;
