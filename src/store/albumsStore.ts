import { makeAutoObservable, runInAction } from "mobx";
import { getAlbums } from "../api";
import { SavedAlbums } from "../utils/interface";

export class AlbumsStore {
  albums: SavedAlbums | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setAlbums = async () => {
    const res = await getAlbums();
    runInAction(() => {
      this.albums = res;
    });
  };
}

export default new AlbumsStore();
