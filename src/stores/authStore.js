import { makeAutoObservable } from "mobx";
import { jwtDecode } from "jwt-decode";

class AuthStore {
  isAuth = false;
  user = null;
  roles = [];
  token = null;

  constructor() {
    makeAutoObservable(this);
    this.loadAuthState();
  }

  login(token) {
    try {
      const decoded = jwtDecode(token);
      this.isAuth = true;
      this.token = token;
      this.user = {
        username: decoded.sub || decoded.username,
        email: decoded.email || "",
      };
      this.roles = decoded.roles || decoded.authorities || [];
      localStorage.setItem("token", token);
      console.log("AuthStore: User logged in", this.user, "Roles:", this.roles);
    } catch (error) {
      console.error("AuthStore: Error decoding token", error);
      this.logout();
    }
  }

  logout() {
    this.isAuth = false;
    this.user = null;
    this.roles = [];
    this.token = null;
    localStorage.removeItem("token");
    console.log("AuthStore: User logged out");
  }

  loadAuthState() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.isAuth = true;
        this.token = token;
        this.user = {
          username: decoded.sub || decoded.username,
          email: decoded.email || "",
        };
        this.roles = decoded.roles || decoded.authorities || [];
        
      } catch (error) {
        console.error("AuthStore: Invalid token in localStorage", error);
        this.logout();
      }
    }
  }

 
}

export default AuthStore;