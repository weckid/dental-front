import AuthStore from "./authStore";

class RootStore {
  constructor() {
    this.authStore = new AuthStore();
  }
}

const rootStore = new RootStore();
export { rootStore, RootStore };