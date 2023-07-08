import { makeAutoObservable, runInAction } from "mobx"
import { getPlayingQueue } from "../api";
import { PlayingQueue } from "../utils/interface";

export class PlayingStore{
    playing: null| PlayingQueue=null
    constructor() {
        makeAutoObservable(this);
    }

    setPlaying = async() => {
        const playingList = await getPlayingQueue();
        runInAction(() => {
            this.playing = playingList
        })
    }
}

export default new PlayingStore();