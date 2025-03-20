import React, { useState } from "react";
import "./HeaderStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

export const Header = observer (() => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
    <header className="header">
       <div className="logo">
        <Link to="/MainContent">
        <img src="/logo.png" alt="Logo" />
        </Link>
       </div>
       <nav className="nav">
        <ul>
          <Link to="/About">О нас</Link>
          <Link to ="/Contacts">Контакты</Link>
          <Link to ="/Entry">Запись</Link>
          <Link to ="/Catalog">Каталог услуг</Link>
        </ul>
        <div className="nav_img">
          <Link to="/Profile">
          <img src="/customer.png" alt="" />
          </Link>
        </div>
       </nav>
    </header>
    );
});
