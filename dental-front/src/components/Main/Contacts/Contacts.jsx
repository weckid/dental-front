import React from "react";
import "./ContactsStyle.css";

const Contacts = () => {
    return (
        <main>
        <div class="container">
          <section class="contacts">
            <div class="contact_heading">
              <h1>Общая информация о клинике:</h1>
            </div>
            <div class="contact_info">
              <h2>
                Мы рады приветствовать вас на нашем сайте! RX — это современная стоматологическая клиника, где забота о вашем здоровье и комфорте стоит на первом месте.
              </h2>
            </div>
            <div class="contact_table">
              <div class="contact_row">
                <h3>График работы</h3>
                <p>
                  Пн.- Пт: 9:00 – 18:00 <br />
                  Сб: 10:00 – 15:00 <br />
                  Вс: выходной
                </p>
              </div>
              <hr />
              <div class="contact_row">
                <h3>Адрес</h3>
                <p>г. Альметьевск, ул. Ленина, д. 123</p>
                <h3>Почта регистратуры</h3>
                <p>mailto:info@rx-clinic.ru</p>
              </div>
              <hr />
              <div class="contact_row">
                <h3>Где припарковать автомобиль?</h3>
                <p>Рядом с стоматологией расположена муниципальная платная парковка</p>
              </div>
            </div>
            <div class="subtitle">
              <h2>Приходите к нам на прием</h2>
            </div>
            <div class="contact_cards">
              <div class="contact_card">
                <h2>Клиника на Ленина</h2>
                <p>
                  Адрес: <br />
                  г. Альметьевск, ул. Ленина, д. 123
                </p>
                <div class="contact_button">
                  <a href="./entry.html">Записаться</a>
                </div>
              </div>
              <div class="contact_card">
                <h2>Клиника на Чистопольской</h2>
                <p>
                  Адрес: <br />
                  г. Казань, ул. Чистопольская, 16/15
                </p>
                <div class="contact_button">
                  <a href="./entry.html">Записаться</a>
                </div>
              </div>
            </div>
            <div class="contact_img">
              <img src="../image/contact.png" alt="#" />
            </div>
          </section>
        </div>
        </main>
    );
};