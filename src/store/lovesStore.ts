import { makeAutoObservable, runInAction } from "mobx";
import { getTracks } from "../api";
import { Loves } from "../utils/interface";
import http from "../utils/http";

export class LovesStore {
  loves = {
    href: "",
    limit: 0,
    next: "",
    offset: 0,
    previous: "",
    total: 0,
    items: [],
  } as Loves;
  constructor() {
    makeAutoObservable(this);
  }

  setLoves = async () => {
    const res = await getTracks();
    runInAction(() => {
      this.loves = res;
    });
  };

  next = async () => {
    if (this.loves.next) {
      const res = await http.get<any, Loves>(this.loves.next);
      runInAction(() => {
        this.loves.next = res.next;
        this.loves.items = [...this.loves.items, ...res.items];
      });
    }
  };
}

export default new LovesStore();
