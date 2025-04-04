import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileStyle.css";
import { rootStore } from "../../../stores/rootStore";

const anonymousAvatar = "/anonymous.jpg";

const Profile = () => {
  const [userData, setUserData] = useState({
    login: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    photoUrl: "",
  });
  const [editData, setEditData] = useState({ ...userData, oldPassword: "", newPassword: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [phoneError, setPhoneError] = useState(""); // Состояние для ошибки номера телефона
  const navigate = useNavigate();
  const { authStore } = rootStore;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("http://localhost:8080/api/auth/profile", {
          withCredentials: true,
        });

        const data = {
          login: response.data.username || "",
          email: response.data.email || "",
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          phone: response.data.phone || "",
          photoUrl: response.data.photoUrl || "",
        };
        setUserData(data);
        setEditData({ ...data, oldPassword: "", newPassword: "" });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Не удалось загрузить данные профиля");
        if (error.response?.status === 401) {
          authStore.logout();
          navigate("/Login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, authStore]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));

    // Валидация номера телефона при изменении
    if (name === "phone") {
      validatePhone(value);
    }
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  // Функция валидации номера телефона
  const validatePhone = (phone) => {
    const phoneRegex = /^\+?\d{10,11}$/; // Пример: +79991234567 или 89991234567
    if (!phone) {
      setPhoneError(""); // Пустое поле допустимо
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("Введите корректный номер телефона (10-11 цифр, можно с +)");
    } else {
      setPhoneError("");
    }
    return phoneRegex.test(phone) || !phone; // Возвращаем true, если номер валиден или пустой
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Проверяем валидность номера телефона перед отправкой
    if (!validatePhone(editData.phone)) {
      return; // Прерываем отправку, если номер некорректен
    }

    try {
      const formData = new FormData();
      formData.append("login", editData.login);
      formData.append("email", editData.email);
      formData.append("firstName", editData.firstName);
      formData.append("lastName", editData.lastName);
      formData.append("phone", editData.phone);
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      if (editData.oldPassword) formData.append("oldPassword", editData.oldPassword);
      if (editData.newPassword) formData.append("newPassword", editData.newPassword);

      const response = await axios.patch(
        "http://localhost:8080/api/auth/profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedData = {
        login: response.data.username || "",
        email: response.data.email || "",
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        phone: response.data.phone || "",
        photoUrl: response.data.photoUrl || "",
      };
      setUserData(updatedData);
      setEditData({ ...updatedData, oldPassword: "", newPassword: "" });
      setSuccessMessage("Профиль успешно обновлён!");
      setIsEditing(false);
      setPhoneError(""); // Очищаем ошибку после успешной отправки
      setPhotoFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Ошибка при обновлении профиля");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <div className="loading-spinner">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <div className="error-message">{error}</div>
          <button className="profile-btn" onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1 className="profile-title">Мой профиль</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {!isEditing ? (
          <div className="profile-info">
            <img
              src={userData.photoUrl || anonymousAvatar}
              alt="Profile"
              className="profile-photo"
            />
            <div className="profile-field">
              <span className="profile-label">Логин:</span>
              <span className="profile-value">{userData.login || "Не указано"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{userData.email || "Не указано"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Имя:</span>
              <span className="profile-value">{userData.firstName || "Не указано"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Фамилия:</span>
              <span className="profile-value">{userData.lastName || "Не указано"}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Телефон:</span>
              <span className="profile-value">{userData.phone || "Не указано"}</span>
            </div>
            <div className="profile-actions">
              <button className="profile-btn" onClick={() => setIsEditing(true)}>
                Редактировать профиль
              </button>
            </div>
          </div>
        ) : (
          <form className="profile-info" onSubmit={handleEditSubmit}>
            <div className="profile-field">
              <span className="profile-label">Логин:</span>
              <input
                type="text"
                name="login"
                value={editData.login}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-field">
              <span className="profile-label">Email:</span>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-field">
              <span className="profile-label">Имя:</span>
              <input
                type="text"
                name="firstName"
                value={editData.firstName}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-field">
              <span className="profile-label">Фамилия:</span>
              <input
                type="text"
                name="lastName"
                value={editData.lastName}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-field">
              <span className="profile-label">Телефон:</span>
              <div className="input-container">
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  placeholder="+79991234567"
                />
                {phoneError && <span className="phone-error">{phoneError}</span>}
              </div>
            </div>
            <div className="profile-field">
              <span className="profile-label">Фото:</span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="profile-field">
              <span className="profile-label">Старый пароль:</span>
              <input
                type="password"
                name="oldPassword"
                value={editData.oldPassword}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-field">
              <span className="profile-label">Новый пароль:</span>
              <input
                type="password"
                name="newPassword"
                value={editData.newPassword}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-actions">
              <button type="submit" className="profile-btn" disabled={!!phoneError}>
                Сохранить
              </button>
              <button
                type="button"
                className="profile-btn secondary"
                onClick={() => setIsEditing(false)}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;