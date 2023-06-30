import {makeAutoObservable, runInAction} from "mobx";
import { getTracks } from "../api";
import { Loves } from "../utils/interface";

export class LovesStore {
    loves = {href: "",
        limit: 0,
        next: "",
        offset: 0,
        previous: "",
        total: 0,
        items: []} as Loves;
    constructor() {
        makeAutoObservable(this);
    }

    setLoves = async() =>{
        const res = await getTracks();
        runInAction(() => {
            this.loves = res as Loves;
        })
    }
}

export default new LovesStore();