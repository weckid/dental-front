import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import apiClient from "../../../api/apiClient";
import { rootStore } from "../../../stores/rootStore";
import "./DoctorPanelStyle.css";

const DoctorPanel = observer(() => {
  const { authStore } = rootStore;
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDoctorOrAdmin = authStore.roles.includes("ROLE_DOCTOR") || authStore.roles.includes("ROLE_ADMIN");

  useEffect(() => {
    if (!authStore.isAuth) {
      navigate("/Login");
      return;
    }

    if (!isDoctorOrAdmin) {
      navigate("/Catalog");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await apiClient.get("/appointments/all");
        console.log("Данные заявок:", response.data);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || "Ошибка загрузки заявок");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authStore.isAuth, isDoctorOrAdmin, navigate]);

  const handleAction = async (appointmentId, action) => {
    try {
      if (action === "confirm") {
        await apiClient.put(`/appointments/${appointmentId}/confirm`);
        alert("Заявка подтверждена и удалена");
      } else if (action === "cancel") {
        await apiClient.put(`/appointments/${appointmentId}/cancel`);
        alert("Заявка отменена и удалена");
      }
      await apiClient.delete(`/appointments/${appointmentId}`);
      setAppointments(appointments.filter((app) => app.id !== appointmentId));
    } catch (err) {
      alert(err.response?.data?.message || `Ошибка при ${action === "confirm" ? "подтверждении" : "отмене"} заявки`);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="doctor-panel-container">
      <h1>Панель врача</h1>
      {appointments.length === 0 ? (
        <p>Заявки отсутствуют.</p>
      ) : (
        <ul className="appointments-list">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="appointment-item">
              <div className="appointment-details">
                <h3>{appointment.card.title}</h3>
                <p>Пациент: {appointment.user.username}</p>
                <p>Статус: {appointment.status}</p>
                <p>Дата создания: {new Date(appointment.createdAt).toLocaleString()}</p>
                {appointment.doctor && <p>Врач: {appointment.doctor.username}</p>}
              </div>
              {appointment.status === "На ожидании" && authStore.roles.includes("ROLE_DOCTOR") && (
                <div className="appointment-actions">
                  <select
                    className="action-select"
                    onChange={(e) => {
                      const action = e.target.value;
                      if (action) handleAction(appointment.id, action);
                      e.target.value = ""; // Сбросить выбор
                    }}
                  >
                    <option value="">Выберите действие</option>
                    <option value="confirm">Подтвердить</option>
                    <option value="cancel">Отменить</option>
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default DoctorPanel;