import React from "react";
import loginStore, {LoginStore} from "./loginStore";
import playlistsStore, { PlaylistsStore } from "./playlistsStore";
import albumsStore, { AlbumsStore } from "./albumsStore";
import artistsStore, { ArtistsStore } from "./artistsStore";
import lovesStore, { LovesStore } from "./lovesStore";
import devicesStore, { DevicesStore } from "./devicesStore";
import colorModeStore, { ColorModeStore } from "./ColorModeStore";


class RootStore {
    loginStore: LoginStore
    playlistsStore: PlaylistsStore
    albumsStore: AlbumsStore
    artistsStore: ArtistsStore
    lovesStore: LovesStore
    devicesStore: DevicesStore
    colorModeStore: ColorModeStore
    constructor() {
        this.loginStore = loginStore;
        this.playlistsStore = playlistsStore
        this.albumsStore = albumsStore
        this.artistsStore = artistsStore
        this.lovesStore = lovesStore
        this.devicesStore = devicesStore
        this.colorModeStore = colorModeStore
    }
}

const rootStore = new RootStore();

const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };