import {makeAutoObservable} from "mobx";

export class LoginStore {
    loginStore = false;
    constructor() {
        makeAutoObservable(this);
    }

    setLogin(value: boolean) {
        console.log("set login true");
        this.loginStore = value;
    }
}

const login = new LoginStore()

export default login