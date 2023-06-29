import {makeAutoObservable} from "mobx";

export class LoginStore {
    login = false;
    constructor() {
        makeAutoObservable(this);
    }

    setLogin(value: boolean) {
        this.login = value;
    }
}

export default new LoginStore();