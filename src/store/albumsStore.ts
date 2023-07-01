import {makeAutoObservable, runInAction} from "mobx";
import { getAlbums } from "../api";
import { Albums } from "../utils/interface";

export class AlbumsStore {
    albums = {href: "",
        limit: 0,
        next: "",
        offset: 0,
        previous: "",
        total: 0,
        items: []} as Albums;
    constructor() {
        makeAutoObservable(this);
    }

    setAlbums = async() =>{
        const res  = await getAlbums();
        runInAction(() => {
            this.albums = res as Albums;
        })
    }
}

export default new AlbumsStore();