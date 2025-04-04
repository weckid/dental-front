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
    this.user = {
      username: userData.username,
      email: userData.email,
    };
    localStorage.setItem("auth", JSON.stringify(this.user)); // Сохраняем только username и email
    console.log("AuthStore: User logged in", this.user);
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