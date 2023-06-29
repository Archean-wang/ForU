import React from "react";
import loginStore, {LoginStore} from "./loginStore";
import playlistsStore, { PlaylistsStore } from "./playlistsStore";
import albumsStore, { AlbumsStore } from "./albumsStore";
import artistsStore, { ArtistsStore } from "./artistsStore";


class RootStore {
    loginStore: LoginStore
    playlistsStore: PlaylistsStore
    albumsStore: AlbumsStore
    artistsStore: ArtistsStore
    constructor() {
        this.loginStore = loginStore;
        this.playlistsStore = playlistsStore
        this.albumsStore = albumsStore
        this.artistsStore = artistsStore
    }
}

const rootStore = new RootStore();

const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };