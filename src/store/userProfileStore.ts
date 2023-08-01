import { makeAutoObservable, runInAction } from "mobx";
import { Profile } from "../utils/interface";
import { getUserProfile } from "../api";

export class UserProfileStore {
  userProfile: Profile | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  getUserProfile = async () => {
    const userProfile = await getUserProfile();
    runInAction(() => {
      this.userProfile = userProfile;
    });
  };
}

export default new UserProfileStore();
