import { makeAutoObservable, runInAction } from "mobx";
import { getArtists } from "../api";
import { FollowedArtists } from "../utils/interface";

export class ArtistsStore {
  artists: FollowedArtists | null = null;
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
