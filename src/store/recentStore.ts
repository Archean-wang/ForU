import { makeAutoObservable, runInAction } from "mobx";
import { getRecentTracks } from "../api";
import { RecentTracks } from "../utils/interface";
import http from "../utils/http";

export class RecentStore {
  recentTracks = {
    href: "",
    limit: 0,
    next: "",
    offset: 0,
    total: 0,
    items: [],
  } as RecentTracks;

  constructor() {
    makeAutoObservable(this);
  }

  setRecentTracks = async () => {
    const res = await getRecentTracks();
    runInAction(() => {
      this.recentTracks = res;
    });
  };

  next = async () => {
    if (this.recentTracks.next) {
      const res = await http.get<any, RecentTracks>(this.recentTracks.next);
      runInAction(() => {
        this.recentTracks.next = res.next;
        this.recentTracks.items = [...this.recentTracks.items, ...res.items];
      });
    }
  };

  get tracks() {
    return this.recentTracks.items.map((v) => v.track);
  }
}

export default new RecentStore();
