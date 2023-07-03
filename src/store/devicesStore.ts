import {makeAutoObservable, runInAction} from "mobx";
import { getDevices } from "../api";
import { Device } from "../utils/interface";

export class DevicesStore {
    devices = [] as Device[];
    constructor() {
        makeAutoObservable(this);
    }

    setDevices = async() =>{
        const res  = await getDevices();
        runInAction(() => {
            this.devices = res.devices as Device[];
        })
    }
}

export default new DevicesStore();