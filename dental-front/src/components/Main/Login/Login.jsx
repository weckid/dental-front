import React, { useState } from "react";
import "./LoginStyle.css";
import authService from "../../../api/authService";

export const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "", // Изменили name на username
    email: "",    // Оставляем email только для регистрации
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLoginMode && !formData.username.trim()) {
      newErrors.username = "Имя пользователя обязательно.";
    }
    if (!isLoginMode && !formData.email.trim()) {
      newErrors.email = "Email обязателен.";
    } else if (!isLoginMode && !/\S+@\S+\.\S+/.test(formData.email)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      // Для входа используем только email и password
      const userData = await authService.login(
        formData.email, 
        formData.password
      );
      
      authStore.login(userData); // Синхронизируем хранилища
      setSuccessMessage("Успешный вход!");
      
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Ошибка авторизации");
    }
  };
  

  return (
    <main>
      <div className="container">
        <section className="auth">
          <h1>{isLoginMode ? "Вход" : "Регистрация"}</h1>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">
                {isLoginMode ? "Еmail" : "Имя пользователя "}:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={isLoginMode ? "Введите email" : "Введите имя пользователя"}
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
            
            {!isLoginMode && (
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
            )}
            
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