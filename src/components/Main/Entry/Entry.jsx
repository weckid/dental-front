import React, { useState } from "react";
import "./EntryStyle.css";

export const Entry = () => {
    const [formData, setFormData] = useState({
        phone: "",
        name: "",
        email: "",
        service: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Форма отправлена:", formData);
        // Здесь будет логика отправки данных
    };

    return (
        <main className="entry-page">
            <div className="entry-container">
                {/* Hero секция */}
                <section className="entry-hero">
                    <h1 className="entry-title">Запись на прием к стоматологу</h1>
                    <p className="entry-subtitle">
                        Добро пожаловать в клинику RX! Мы предлагаем современные стоматологические услуги 
                        с комфортом и заботой о каждом пациенте.
                    </p>
                </section>

                {/* Способы записи */}
                <section className="entry-methods">
                    <h2 className="section-title">Способы записи</h2>
                    <div className="methods-grid">
                        <div className="method-card">
                            <div className="method-icon">📱</div>
                            <h3>Онлайн-запись</h3>
                            <p>Заполните форму ниже и мы свяжемся с вами для подтверждения записи</p>
                        </div>
                        <div className="method-card">
                            <div className="method-icon">📞</div>
                            <h3>По телефону</h3>
                            <p><strong>(111) 123-45-67</strong> с 9:00 до 18:00</p>
                        </div>
                        <div className="method-card">
                            <div className="method-icon">💬</div>
                            <h3>Мессенджеры</h3>
                            <p>WhatsApp/Telegram: <strong>(111) 123-45-67</strong></p>
                        </div>
                    </div>
                </section>

                {/* Форма записи */}
                <section className="entry-form-section">
                    <div className="form-container">
                        <h2 className="form-title">Онлайн-запись</h2>
                        <form onSubmit={handleSubmit} className="appointment-form">
                            <div className="form-group">
                                <label htmlFor="name">Ваше имя</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Иван Иванов"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Телефон</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+7 (999) 123-45-67"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.ru"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="service">Услуга</label>
                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Выберите услугу</option>
                                    <optgroup label="Терапевтическая стоматология">
                                        <option value="Лечение кариеса">Лечение кариеса</option>
                                        <option value="Лечение пульпита">Лечение пульпита</option>
                                        <option value="Лечение периодонтита">Лечение периодонтита</option>
                                    </optgroup>
                                    <optgroup label="Хирургическая стоматология">
                                        <option value="Удаление зуба">Удаление зуба</option>
                                        <option value="Имплантация зуба">Имплантация зуба</option>
                                    </optgroup>
                                    <optgroup label="Ортодонтия">
                                        <option value="Установка брекетов">Установка брекетов</option>
                                        <option value="Коррекция прикуса">Коррекция прикуса</option>
                                    </optgroup>
                                    <optgroup label="Эстетическая стоматология">
                                        <option value="Профессиональное отбеливание">Профессиональное отбеливание</option>
                                        <option value="Установка виниров">Установка виниров</option>
                                        <option value="Микроабразия эмали">Микроабразия эмали</option>
                                    </optgroup>
                                </select>
                            </div>
                            <button type="submit" className="submit-btn">
                                Записаться на прием
                            </button>
                        </form>
                    </div>
                </section>

                {/* Подготовка к приему */}
                <section className="preparation-section">
                    <h2 className="section-title">Подготовка к приему</h2>
                    <div className="preparation-tips">
                        <div className="tip-card">
                            <h3>Документы</h3>
                            <p>Возьмите с собой паспорт и медицинский полис (если есть)</p>
                        </div>
                        <div className="tip-card">
                            <h3>Анализы</h3>
                            <p>Принесите результаты предыдущих обследований</p>
                        </div>
                        <div className="tip-card">
                            <h3>Вопросы</h3>
                            <p>Запишите вопросы, которые хотите задать врачу</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};