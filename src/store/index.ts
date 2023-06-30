import React from "react";
import loginStore, {LoginStore} from "./loginStore";
import playlistsStore, { PlaylistsStore } from "./playlistsStore";
import albumsStore, { AlbumsStore } from "./albumsStore";
import artistsStore, { ArtistsStore } from "./artistsStore";
import lovesStore, { LovesStore } from "./lovesStore";


class RootStore {
    loginStore: LoginStore
    playlistsStore: PlaylistsStore
    albumsStore: AlbumsStore
    artistsStore: ArtistsStore
    lovesStore: LovesStore
    constructor() {
        this.loginStore = loginStore;
        this.playlistsStore = playlistsStore
        this.albumsStore = albumsStore
        this.artistsStore = artistsStore
        this.lovesStore = lovesStore
    }
}

const rootStore = new RootStore();

const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };