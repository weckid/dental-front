import React from "react";
import "./MainContentStyle.css";
import { Link } from "react-router-dom";

export const MainContent = () => {
  const features = [
    {
      icon: "/success.png",
      text: "Безопасные операции на современном оборудовании из Европы"
    },
    {
      icon: "/success.png",
      text: "Средний стаж работы докторов в нашей клинике - 10 лет"
    },
    {
      icon: "/success.png",
      text: "Дипломированные специалисты и опытные профессионалы"
    }
  ];

  return (
    <main className="main-container">
      <div className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Добро пожаловать в клинику <span>"RX Альметьевск"</span>
          </h1>
          <p className="hero-subtitle">
            Записаться на прием к стоматологу вы сможете только после регистрации на сайте
          </p>
          
          <div className="action-buttons">
            <Link className="btn btn-primary" to="/Login">
              Регистрация
            </Link>
            <Link className="btn btn-secondary" to="/Entry">
              Записаться на прием
            </Link>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="card-icon">
                <img src={feature.icon} alt="Feature icon" />
              </div>
              <p className="card-text">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};