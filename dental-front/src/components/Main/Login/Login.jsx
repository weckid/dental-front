import React, { useState } from "react";
import "./LoginStyle.css"; 

export const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Режим: вход или регистрация
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // Состояние для хранения ошибок валидации
  const [successMessage, setSuccessMessage] = useState(""); // Сообщение об успешной операции

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLoginMode && !formData.name.trim()) {
      newErrors.name = "Имя обязательно.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный формат email.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Пароль обязателен.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isLoginMode) {
        
        console.log("Вход выполнен:", formData);
        setSuccessMessage("Вы успешно вошли в аккаунт!");
      } else {
        
        console.log("Регистрация выполнена:", formData);
        setSuccessMessage("Регистрация прошла успешно!");
      }
      setFormData({ name: "", email: "", password: "" }); // Очищаем форму
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <main>
      <div className="container">
        <section className="auth">
          <h1>{isLoginMode ? "Вход" : "Регистрация"}</h1>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            {!isLoginMode && (
              <div className="form-group">
                <label htmlFor="name">Имя:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите ваше имя"
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите ваш email"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <button type="submit" className="auth-button">
              {isLoginMode ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
          <p className="switch-mode">
            {isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              type="button"
              className="mode-switch"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? "Зарегистрируйтесь" : "Войдите"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
};