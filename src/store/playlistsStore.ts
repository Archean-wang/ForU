import { makeAutoObservable, runInAction } from "mobx";
import { getPlaylists } from "../api";
import { Playlists } from "../utils/interface";

export class PlaylistsStore {
  playlists: Playlists | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setPlaylists = async () => {
    const res = await getPlaylists();
    runInAction(() => {
      this.playlists = res;
    });
  };
}

export default new PlaylistsStore();
