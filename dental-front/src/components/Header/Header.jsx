import React, { useState, useEffect } from "react";
import "./HeaderStyle.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";

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

export const Header = observer(() => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { authStore } = rootStore;
  
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    authStore.logout(); // Вызываем метод выхода из хранилища
    navigate("/"); // Перенаправляем на главную страницу
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo">
          <Link to="/MainContent">
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>
        
        <div className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/About">О нас</Link></li>
            <li><Link to="/Contacts">Контакты</Link></li>
            <li><Link to="/Entry">Запись</Link></li>
            <li><Link to="/Catalog">Каталог услуг</Link></li>
            {authStore.isAuth ? (
              <li className="mobile-login">
                <button onClick={handleLogout}>Выход</button>
              </li>
            ) : (
              <li className="mobile-login">
                <Link to="/Login">Вход</Link>
              </li>
            )}
          </ul>
        </div>
        
        <div className="desktop-login">
          {authStore.isAuth ? (
            <button onClick={handleLogout}>Выход</button>
          ) : (
            <Link to="/Login">Вход</Link>
          )}
        </div>
        
        <button className={`burger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
    </div>
  );
});