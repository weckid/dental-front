import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { rootStore } from "../../../stores/rootStore";
import "./AppointmentsStyle.css";

const BASE_URL = "http://localhost:8080";
const defaultImage = "http://localhost:5173/default.jpg";

export const Appointments = observer(() => {
  const { authStore } = rootStore;
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка, является ли пользователь доктором или админом
  const isDoctorOrAdmin = authStore.roles.includes("ROLE_DOCTOR") || authStore.roles.includes("ROLE_ADMIN");

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

    // Перенаправление для докторов и админов
    if (isDoctorOrAdmin) {
      navigate("/Catalog");
      return;
    }

    // Загрузка заявок только для ROLE_USER
    const fetchAppointments = async () => {
      try {
        const response = await apiClient.get("/appointments/user");
        console.log("Данные заявок:", response.data);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Ошибка загрузки заявок");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authStore.isAuth, isDoctorOrAdmin, navigate]);

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту заявку?")) {
      try {
        await apiClient.delete(`/appointments/${appointmentId}`);
        setAppointments(appointments.filter((app) => app.id !== appointmentId));
      } catch (err) {
        alert(err.response?.data?.message || "Ошибка удаления заявки");
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="appointments-container">
      <h1>Мои услуги</h1>
      {appointments.length === 0 ? (
        <p>У вас нет активных заявок.</p>
      ) : (
        <ul className="appointments-list">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <div className="card-horizontal">
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
                  <h3>{appointment.card.title}</h3>
                  <p className="card-price">Цена: {formatPrice(appointment.card.price)}</p>
                  <p>Статус: {appointment.status}</p>
                  <p>Дата создания: {new Date(appointment.createdAt).toLocaleString()}</p>
                  {appointment.doctor && (
                    <p>Врач: {appointment.doctor.username}</p>
                  )}
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(appointment.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        className="add-service-button"
        onClick={() => navigate("/Catalog")}
      >
        Добавить услугу
      </button>
    </div>
  );
});