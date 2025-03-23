import React from "react";
import "./ContactsStyle.css";
import { Link } from "react-router-dom";

export const Contacts = () => {
    return (
        <main className="contacts-main">
            <div className="container">
                <section className="contacts">
                    <div className="contact_heading">
                        <h1>Общая информация о клинике:</h1>
                    </div>
                    <div className="contact_info">
                        <h2>
                            Мы рады приветствовать вас на нашем сайте! RX — это современная стоматологическая клиника, где забота о вашем здоровье и комфорте стоит на первом месте.
                        </h2>
                    </div>
                    <div className="contact_table">
                        <div className="contact_row">
                            <h3>График работы</h3>
                            <p>
                                Пн.- Пт: 9:00 – 18:00 <br />
                                Сб: 10:00 – 15:00 <br />
                                Вс: выходной
                            </p>
                        </div>
                        <hr />
                        <div className="contact_row">
                            <h3>Адрес</h3>
                            <p>г. Альметьевск, ул. Ленина, д. 123</p>
                            <h3>Почта регистратуры</h3>
                            <p>mailto:info@rx-clinic.ru</p>
                        </div>
                        <hr />
                        <div className="contact_row">
                            <h3>Где припарковать автомобиль?</h3>
                            <p>Рядом с стоматологией расположена муниципальная платная парковка</p>
                        </div>
                    </div>
                    <div className="subtitle">
                        <h2>Приходите к нам на прием</h2>
                    </div>
                    <div className="contact_cards">
                        <div className="contact_card">
                            <h2>Клиника на Ленина</h2>
                            <p>
                                Адрес: <br />
                                г. Альметьевск, ул. Ленина, д. 123
                            </p>
                            <div className="contact_button">
                                <Link to="/Entry">Записаться</Link>
                            </div>
                        </div>
                        <div className="contact_card">
                            <h2>Клиника на Чистопольской</h2>
                            <p>
                                Адрес: <br />
                                г. Казань, ул. Чистопольская, 16/15
                            </p>
                            <div className="contact_button">
                                <Link to="/Entry">Записаться</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};