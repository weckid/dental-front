import React from "react";
import "./MainContentStyle.css"
import { Link } from "react-router-dom";
export const MainContent = () => {
  return (
    <main>
    <div className="background_img"></div>
      <div className="main_info">
        <h1>Добро пожаловать в клинику <span>"RX Альметьевск"</span></h1>
        <h2>
          Записаться на прием к стоматологу вы сможете 
          только после регистрации на сайте
        </h2>
        <div className="buttons">
          <Link className="button1" to="/Profile">Регистрация</Link>
          <Link className="button2" to="/Entry">Записаться на прием к врачу</Link>
        </div>
        <div className="cards">
          <div className="card">
              <div className="image">
              <img src="/success.png" alt=""/>
            </div>
            <div className="card_text">
              <p>
                Безопасные операции на современном оборудовании из Европы
              </p>
            </div>
          </div>
          <div className="card">
              <div className="image">
                <img src="/success.png" alt=""/>
              </div>
              <div className="card_text">
                <p>Средний стаж работы докторов в нашей клиники - 10 лет</p>
              </div>
          </div>
          <div className="card flex-3">
              <div className="image">
                <img src="/success.png" alt=""/>
              </div>
              <div className="card_text">
                <p>Дипломированные специалисты и опытные профессионалы</p>
              </div>
          </div>
        </div>
      </div>
  </main>
  );
};