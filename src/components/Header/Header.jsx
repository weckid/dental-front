import React, { useState, useEffect } from "react";
import "./HeaderStyle.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";
import authService from "../../api/authService";

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

    const handleLogout = async () => {
        try {
            console.log("Header: Starting logout process");
            await authService.logout();
            authStore.logout();
            console.log("Header: Logout completed");
            navigate("/Login");
        } catch (error) {
            console.error("Header: Logout error:", error);
            authStore.logout();
            navigate("/Login");
        }
    };

    const isAdmin = authStore.isAuth && authStore.roles?.includes("ROLE_ADMIN");
    const isDoctor = authStore.isAuth && authStore.roles?.includes("ROLE_DOCTOR");

    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="logo">
                    <Link to="/MainContent">
                        <img src="/logo.png" alt="Logo" />
                    </Link>
                </div>

                <div className={`nav ${isMenuOpen ? "active" : ""}`}>
                    <ul>
                        <li><Link to="/About">О нас</Link></li>
                        <li><Link to="/Contacts">Контакты</Link></li>
                        {authStore.isAuth ? (
                            <li><Link to="/Appointments">Услуги</Link></li>
                        ) : (
                            <li><Link to="/Entry">Запись</Link></li>
                        )}
                        <li><Link to="/Catalog">Каталог услуг</Link></li>
                        {isAdmin && (
                            <li className="mobile-login"><Link to="/admin">Админ-панель</Link></li>
                        )}
                        {isDoctor && (
                            <li className="mobile-login"><Link to="/doctor">Панель врача</Link></li>
                        )}
                        {authStore.isAuth && (
                            <li className="mobile-login"><Link to="/Profile">Профиль</Link></li>
                        )}
                        {authStore.isAuth ? (
                            <li className="mobile-login">
                                <Link to="#" onClick={handleLogout}>Выход</Link>
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
                        <>
                            {isAdmin && <Link to="/admin">Админ-панель</Link>}
                            {isDoctor && <Link to="/doctor">Панель врача</Link>}
                            <Link to="/Profile">Профиль</Link>
                            <Link to="#" onClick={handleLogout}>Выход</Link>
                        </>
                    ) : (
                        <>
                            {/* <Link to="/Entry">Запись</Link> */}
                            <Link to="/Login">Вход</Link>
                        </>
                    )}
                </div>

                <button className={`burger-menu ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>
        </div>
    );
});