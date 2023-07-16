import { makeAutoObservable, runInAction } from "mobx";
import { getArtists } from "../api";
import { FollowedArtists } from "../utils/interface";

export class ArtistsStore {
  artists = {
    artists: {
      href: "string",
      limit: 0,
      next: "string",
      total: 0,
      items: [],
    },
  } as FollowedArtists;
  constructor() {
    makeAutoObservable(this);
  }

  setArtists = async () => {
    const res = await getArtists();
    runInAction(() => {
      this.artists = res;
    });
  };
}

export default new ArtistsStore();
