import React from "react";
import login from "./loginStore";
import {LoginStore} from "./loginStore";


class RootStore {
    loginStore: LoginStore;
    constructor() {
        this.loginStore = login;
    }
}

const rootStore = new RootStore();

const context = React.createContext(rootStore);

const useStore = () => React.useContext(context);

export { useStore };