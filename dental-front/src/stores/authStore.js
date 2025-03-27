import { makeAutoObservable } from "mobx";

class AuthStore {
  isAuth = false;
  user = null;

  constructor() {
    makeAutoObservable(this);
    this.loadAuthState();
  }

  login(userData) {
    this.isAuth = true;
    this.user = userData;
    localStorage.setItem("auth", JSON.stringify(userData));
    console.log("After login - isAuth:", this.isAuth);
  }

  logout() {
    this.isAuth = false;
    this.user = null;
    localStorage.removeItem("auth");
  }

  loadAuthState() {
    const authData = localStorage.getItem("auth");
    if (authData) {
      this.isAuth = true;
      this.user = JSON.parse(authData);
    }
  }
}

export default AuthStore;