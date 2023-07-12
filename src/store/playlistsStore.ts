import {makeAutoObservable, runInAction} from "mobx";
import { getPlaylists } from "../api";
import { Playlists } from "../utils/interface";

export class PlaylistsStore {
    playlists = {href: "",
        limit: 0,
        next: "",
        offset: 0,
        previous: "",
        total: 0,
        items: []} as Playlists;
    constructor() {
        makeAutoObservable(this);
    }

    setPlaylists = async() =>{
        const res  = await getPlaylists();
        runInAction(() => {
            this.playlists = res;
        })
    }
}

export default new PlaylistsStore();