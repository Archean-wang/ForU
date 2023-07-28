import { makeAutoObservable, runInAction } from "mobx";
import { getTop } from "../api";
import { Artists, TopTracks } from "../utils/interface";

export class TopItemsStore {
  topTracks = {
    href: "",
    limit: 0,
    next: "",
    offset: 0,
    previous: "",
    total: 0,
    items: [],
  } as TopTracks;

  topArtists = {
    href: "",
    limit: 0,
    next: "",
    offset: 0,
    previous: "",
    total: 0,
    items: [],
  } as Artists;
  constructor() {
    makeAutoObservable(this);
  }

  setTopTracks = async () => {
    const res = await getTop("tracks");
    runInAction(() => {
      this.topTracks = res as TopTracks;
    });
  };

  setTopArtists = async () => {
    const res = await getTop("artists");
    runInAction(() => {
      this.topArtists = res as Artists;
    });
  };
}

export default new TopItemsStore();
