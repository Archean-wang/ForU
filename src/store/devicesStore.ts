import { makeAutoObservable, runInAction } from "mobx";
import { getDevices } from "../api";
import { Device } from "../utils/interface";

export class DevicesStore {
  devices: Device[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  setDevices = async () => {
    const res = await getDevices();
    runInAction(() => {
      this.devices = res.devices;
    });
  };
}

export default new DevicesStore();
