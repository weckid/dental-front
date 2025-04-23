import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { rootStore } from "../../../stores/rootStore";
import apiClient from "../../../api/apiClient";
import "./AppointmentStyle.css";

const BASE_URL = "http://localhost:8080";
const defaultImage = "http://localhost:5173/default.jpg";

export const Appointment = observer(() => {
  const { authStore } = rootStore;
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointment, setAppointment] = useState(location.state?.appointment || null);
  const [loading, setLoading] = useState(!appointment);
  const [error, setError] = useState(null);

  // Функция для формирования URL изображения
  const getImage = (image) => {
    if (!image) {
      console.log("Изображение отсутствует, используется defaultImage");
      return defaultImage;
    }
    let normalizedImage = image.replace(/(http:\/\/localhost:8080)+/, "");
    normalizedImage = normalizedImage.replace(/^\/+/, "");
    if (!normalizedImage.startsWith("Uploads/cards/")) {
      normalizedImage = `Uploads/cards/${normalizedImage}`;
    }
    const fullUrl = `${BASE_URL}/${normalizedImage}`;
    console.log("Формируем URL изображения:", fullUrl);
    return fullUrl;
  };

  // Функция для форматирования цены с пробелами и знаком рубля
  const formatPrice = (price) => {
    if (!price) return "";
    const [integerPart, decimalPart] = price.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const formattedPrice = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    return `${formattedPrice} ₽`;
  };

  useEffect(() => {
    if (!authStore.isAuth) {
      navigate("/Login");
      return;
    }

    if (!appointment && id) {
      const fetchAppointment = async () => {
        try {
          const response = await apiClient.get(`/appointments/${id}`);
          console.log("Данные заявки:", response.data);
          setAppointment(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || "Ошибка загрузки заявки");
          setLoading(false);
        }
      };
      fetchAppointment();
    } else {
      setLoading(false);
    }
  }, [authStore.isAuth, appointment, id, navigate]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!appointment) return <div>Заявка не найдена</div>;

  return (
    <div className="appointment-container">
      <h1>Запись на приём подтверждена</h1>
      <div className="appointment-card">
        <img
          src={getImage(appointment.card.image)}
          alt={appointment.card.title}
          className="card-image"
          onError={(e) => {
            console.error(`Ошибка загрузки изображения: ${appointment.card.image}`);
            e.target.src = defaultImage;
          }}
          onLoad={() => console.log(`Изображение загружено: ${appointment.card.image}`)}
        />
        <div className="card-content">
          <h2>{appointment.card.title}</h2>
          <p className="card-price">Цена: {formatPrice(appointment.card.price)}</p>
          <p>Статус: {appointment.status}</p>
          <p>Дата создания: {new Date(appointment.createdAt).toLocaleString()}</p>
          {appointment.doctor && <p>Врач: {appointment.doctor.username}</p>}
        </div>
      </div>
      <div className="action-buttons">
        <button className="appointments-button" onClick={() => navigate("/Appointments")}>
          Перейти к моим услугам
        </button>
        <button className="catalog-button" onClick={() => navigate("/Catalog")}>
          Вернуться в каталог
        </button>
      </div>
    </div>
  );
});