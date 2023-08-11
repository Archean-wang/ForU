import { makeAutoObservable } from "mobx";

export class GlobalToastStore {
  successMessage: string = "";
  errorMessage: string = "";
  constructor() {
    makeAutoObservable(this);
  }

  setSuccessMessage(message: string) {
    this.successMessage = message;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}

export default new GlobalToastStore();
