import { makeAutoObservable, runInAction } from "mobx";
import { getAlbums } from "../api";
import { SavedAlbums } from "../utils/interface";

export class AlbumsStore {
  albums = {
    href: "",
    limit: 0,
    next: "",
    offset: 0,
    previous: "",
    total: 0,
    items: [],
  } as SavedAlbums;
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
