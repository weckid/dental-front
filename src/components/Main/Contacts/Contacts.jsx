import React, { useEffect, useState } from "react";
import "./ContactsStyle.css";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";

const localDoctors = [
    {
      id: 1,
      name: "Левин Борис Аркадьевич",
      specialty: "Стоматолог-терапевт",
      experience: "12 лет",
      photo: "/doctor1.jpg",
      schedule: "Пн-Пт: 9:00-18:00"
    },
    {
      id: 2,
      name: "Быков Андрей Евгеньевич",
      specialty: "Хирург-стоматолог",
      experience: "20 лет",
      photo: "/doctor2.jpg",
      schedule: "Вт-Сб: 10:00-19:00"
    },
    {
      id: 3,
      name: "Лобанов Семен Семенович",
      specialty: "Ортодонт",
      experience: "15 лет",
      photo: "/doctor3.jpg",
      schedule: "Пн-Ср-Пт: 8:00-16:00"
    },
    {
        id: 4,
        name: "Скрябина Любовь Михайловна",
        specialty: "Старшая медсестра",
        experience: "10 лет",
        photo: "/doctor4.jpg",
        schedule: "Пн-Вт-Пт: 10:00-18:00"
      }
  ];
  

  export const Contacts = () => {
    const [doctorsList, setDoctorsList] = useState([]);
    
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchDoctors = async () => {
        try {
          // Пробуем получить данные с бэкенда
          const response = await apiClient.get('/doctors');
          setDoctorsList(response.data);
        } catch (err) {
          console.error('Ошибка при получении данных:', err);
          setError(err);
          // Используем локальные данные при ошибке
          setDoctorsList(localDoctors);
        } 
      };
  
      fetchDoctors();
    }, []);
    if (error) {
      console.log('Используем локальные данные из-за ошибки подключения');
    }
    return (
        <main className="contacts-main">
            <div className="contacts-container">
                <section className="contacts-content">
                    <div className="contact-header">
                        <h1>Контакты клиники RX</h1>
                        <p className="subtitle">Мы всегда рады видеть вас в нашей клинике</p>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-card">
                            <div className="icon-wrapper">
                                <img src="/clock-icon.svg" alt="Часы работы" />
                            </div>
                            <h3>График работы</h3>
                            <ul className="contact-list">
                                <li>Пн-Пт: 9:00 – 18:00</li>
                                <li>Сб: 10:00 – 15:00</li>
                                <li>Вс: выходной</li>
                            </ul>
                        </div>

                        <div className="contact-card">
                            <div className="icon-wrapper">
                                <img src="/location-icon.svg" alt="Адрес" />
                            </div>
                            <h3>Адреса клиник</h3>
                            <ul className="contact-list">
                                <li>г. Альметьевск, ул. Ленина, 123</li>
                                <li>г. Казань, ул. Чистопольская, 16/15</li>
                            </ul>
                        </div>

                        <div className="contact-card">
                            <div className="icon-wrapper">
                                <img src="/email-icon.svg" alt="Почта" />
                            </div>
                            <h3>Контактная информация</h3>
                            <ul className="contact-list">
                                <li>info@rx-clinic.ru</li>
                                <li>+7 (8553) 12-34-56</li>
                            </ul>
                        </div>

                        <div className="contact-card">
                            <div className="icon-wrapper">
                                <img src="/parking-icon.svg" alt="Парковка" />
                            </div>
                            <h3>Парковка</h3>
                            <p>Рядом с клиникой расположена муниципальная платная парковка</p>
                        </div>
                    </div>

                    <div className="clinics-section">
                        <h2>Наши клиники</h2>
                        <div className="clinic-cards">
                            <div className="clinic-card">
                                <div className="clinic-image" style={{backgroundImage: "url('/clinic1.jpg')"}}></div>
                                <div className="clinic-info">
                                    <h3>Клиника на Ленина</h3>
                                    <p>г. Альметьевск, ул. Ленина, д. 123</p>
                                    <Link to="/Entry" className="appointment-btn">Записаться</Link>
                                </div>
                            </div>

                            <div className="clinic-card">
                                <div className="clinic-image" style={{backgroundImage: "url('/clinic2.jpg')"}}></div>
                                <div className="clinic-info">
                                    <h3>Клиника на Чистопольской</h3>
                                    <p>г. Казань, ул. Чистопольская, 16/15</p>
                                    <Link to="/Entry" className="appointment-btn">Записаться</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="doctors-section">
                <div className="section-header">
                    <h2>Наши специалисты</h2>
                </div>
                    
                    <div className="doctors-grid">
                        {doctorsList.map(doctor => (
                            <div className="doctor-card" key={doctor.id}>
                                <div className="doctor-photo">
                                    <img src={doctor.photo} alt={doctor.name} />
                                </div>
                                <div className="doctor-info">
                                    <h3>{doctor.name}</h3>
                                    <p className="specialty">{doctor.specialty}</p>
                                    <div className="doctor-details">
                                        <p><strong>Стаж:</strong> {doctor.experience}</p>
                                        <p><strong>График:</strong> {doctor.schedule}</p>
                                    </div>
                                    <Link 
                                        to={`/Entry?doctor=${encodeURIComponent(doctor.name)}`} 
                                        className="appointment-btn"
                                    >
                                        Записаться
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};