import { PaletteMode } from "@mui/material";
import { makeAutoObservable } from "mobx";

export class ColorModeStore {
    mode:PaletteMode = localStorage.getItem("mode") ? localStorage.getItem("mode") as PaletteMode : "light";
    constructor() {
        makeAutoObservable(this);
    }

    toggleMode() {
        this.mode = this.mode === "light" ? "dark" : "light";
        localStorage.setItem("mode", this.mode);
    }
}

export default new ColorModeStore();