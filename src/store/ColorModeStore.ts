import { PaletteMode } from "@mui/material";
import { makeAutoObservable } from "mobx";

export class ColorModeStore {
    mode:PaletteMode = "light"
    constructor() {
        makeAutoObservable(this);
    }

    toggleMode() {
        this.mode = this.mode === "light" ? "dark" : "light";
    }
}

export default new ColorModeStore();