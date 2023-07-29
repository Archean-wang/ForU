import { computed, makeAutoObservable, runInAction } from "mobx";
import { getTop } from "../api";
import { Artists, TopTracks } from "../utils/interface";
import http from "../utils/http";

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
    makeAutoObservable(this, {
      tracks: computed,
    });
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

  get tracks() {
    return this.topTracks.items;
  }

  nextTopArtists = async () => {
    if (this.topArtists.next) {
      const res = await http.get<any, Artists>(this.topArtists.next);
      runInAction(() => {
        this.topArtists.next = res.next;
        this.topArtists.items = [...this.topArtists.items, ...res.items];
      });
    }
  };

  nextTopTracks = async () => {
    if (this.topTracks.next) {
      const res = await http.get<any, TopTracks>(this.topTracks.next);
      runInAction(() => {
        this.topTracks.next = res.next;
        this.topTracks.items = [...this.topTracks.items, ...res.items];
      });
    }
  };
}

export default new TopItemsStore();
