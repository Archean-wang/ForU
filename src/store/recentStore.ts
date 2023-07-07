import {makeAutoObservable, runInAction} from "mobx";
import { getRecentTracks } from "../api";
import { RecentTracks } from "../utils/interface";

export class RecentStore {
    recentTracks = {href: "",
    limit: 0,
    next: "",
    offset: 0,
    total: 0,
    items: []} as RecentTracks

    constructor() {
        makeAutoObservable(this);
    }

    setRecentTracks= async() =>{
        const res  = await getRecentTracks();
        runInAction(() => {
            this.recentTracks = res as RecentTracks;

        })
    }
}

export default new RecentStore();