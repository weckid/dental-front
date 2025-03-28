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
    console.log("AuthStore: User logged in", userData);
  }

  logout() {
    this.isAuth = false;
    this.user = null;
    localStorage.removeItem("auth");
    console.log("AuthStore: User logged out");
  }

  loadAuthState() {
    const authData = localStorage.getItem("auth");
    if (authData) {
      this.isAuth = true;
      this.user = JSON.parse(authData);
      console.log("AuthStore: Loaded user from localStorage", this.user);
    }
  }
   printState() {
    console.log(`Auth state: isAuth=${this.isAuth}, user=`, this.user);
  }
}

export default AuthStore;