import React, { useState, useEffect } from "react";
import "./HeaderStyle.css";
import { Link, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

export const Header = observer(() => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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
            <li className="mobile-login"><Link to="/Profile">Вход</Link></li>
          </ul>
        </div>
        <div className="desktop-login">
  <Link to="/Profile">Вход</Link>
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