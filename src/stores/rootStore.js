import { createContext, useContext } from 'react';
import AuthStore from "./authStore";

class RootStore {
  constructor() {
    this.authStore = new AuthStore();
  }
}

const rootStore = new RootStore();
const StoreContext = createContext(rootStore);

export const useStore = () => useContext(StoreContext);
export { rootStore };