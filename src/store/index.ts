import React from "react";
import playlistsStore, { PlaylistsStore } from "./playlistsStore";
import albumsStore, { AlbumsStore } from "./albumsStore";
import artistsStore, { ArtistsStore } from "./artistsStore";
import lovesStore, { LovesStore } from "./lovesStore";
import devicesStore, { DevicesStore } from "./devicesStore";
import colorModeStore, { ColorModeStore } from "./colorModeStore";
import topItemsStore, { TopItemsStore } from "./topItemsStore";
import recentStore, { RecentStore } from "./recentStore";
import playingStore, { PlayingStore } from "./playingStore";
import userProfileStore, { UserProfileStore } from "./userProfileStore";
import settingsStore, { SettingsStore } from "./settingsStore";
import globalToastStore, { GlobalToastStore } from "./globalToastStore";

class RootStore {
  playlistsStore: PlaylistsStore;
  albumsStore: AlbumsStore;
  artistsStore: ArtistsStore;
  lovesStore: LovesStore;
  devicesStore: DevicesStore;
  colorModeStore: ColorModeStore;
  topItemsStore: TopItemsStore;
  recentStore: RecentStore;
  playingStore: PlayingStore;
  userProfilseStore: UserProfileStore;
  settingsStore: SettingsStore;
  globalToastStore: GlobalToastStore;
  constructor() {
    this.playlistsStore = playlistsStore;
    this.albumsStore = albumsStore;
    this.artistsStore = artistsStore;
    this.lovesStore = lovesStore;
    this.devicesStore = devicesStore;
    this.colorModeStore = colorModeStore;
    this.topItemsStore = topItemsStore;
    this.recentStore = recentStore;
    this.playingStore = playingStore;
    this.userProfilseStore = userProfileStore;
    this.settingsStore = settingsStore;
    this.globalToastStore = globalToastStore;
  }
}

const rootStore = new RootStore();

const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };
