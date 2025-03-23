import React, { useState } from "react";
import "./EntryStyle.css";

export const Entry = () => {
    // Состояние для выбранной услуги
    const [selectedService, setSelectedService] = useState("");

    // Обработчик изменения выбора в select
    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
    };

    return (
        <main className="main_entry">
            <div className="container">
                <section className="entry">
                    {/* Заголовок */}
                    <div className="heading">
                        <h1>Запись на прием к врачу</h1>
                        <h2>
                            Добро пожаловать в клинику RX! Мы рады помочь вам заботиться о вашем здоровье. Чтобы сделать процесс записи на прием к стоматологу максимально удобным и быстрым, следуйте нашим простым инструкциям.
                        </h2>
                    </div>

                    {/* Способы записи */}
                    <div className="entry_text">
                        <h3>Способы записи:</h3>
                        <ul>
                            <li>
                                <h4>1. Онлайн-запись</h4>
                                <p>
                                    Используйте нашу удобную форму онлайн-записи. Просто выберите нужного специалиста, дату и время приема. После заполнения формы вы получите подтверждение на указанный вами адрес электронной почты или по телефону.
                                </p>
                            </li>
                            <li>
                                <h4>2. Запись по телефону</h4>
                                <p>
                                    Вы можете записаться на прием, позвонив нам по телефону: <strong>(111) 123-45-67</strong>. Наши операторы работают с 9:00 до 18:00 и с радостью ответят на все ваши вопросы.
                                </p>
                            </li>
                            <li>
                                <h4>3. Запись через мессенджеры</h4>
                                <p>
                                    Напишите нам в WhatsApp или Telegram по номеру <strong>(111) 123-45-67</strong>. Мы ответим вам в течение 15 минут и поможем с записью.
                                </p>
                            </li>
                        </ul>
                    </div>

                    {/* Подготовка к приему */}
                    <div className="entry_preparation">
                        <h3>Подготовка к приему:</h3>
                        <ul>
                            <li>
                                <h4>Для того чтобы ваш визит прошел максимально эффективно, рекомендуем:</h4>
                                <ul>
                                    <li>Принести все медицинские документы, результаты анализов и исследования, если таковые имеются.</li>
                                    <li>Подготовить список вопросов или жалоб к врачу, чтобы не забыть важные моменты.</li>
                                    <li>Если необходимо, возьмите с собой страховой полис и документ, удостоверяющий личность.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {/* Форма записи */}
                    <div className="entry_end">
                        <h1>Запись на прием к стоматологу</h1>
                        <div className="entry_forms">
                            <div className="entry_form">
                                <h2>Заполните форму</h2>
                                <div className="entry_input">
                                    <input type="text" placeholder="Введите свой номер телефона" />
                                    <input type="text" placeholder="Введите свое имя" />
                                    <input type="email" placeholder="Введите свою электронную почту" />
                                    <select
                                        name="service"
                                        value={selectedService}
                                        onChange={handleServiceChange}
                                    >
                                        <option value="" disabled>
                                            Выберите услугу
                                        </option>
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
                                <button type="submit" className="btnn">Отправить</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};