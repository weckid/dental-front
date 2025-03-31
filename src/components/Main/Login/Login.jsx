import React, { useState } from "react";
import "./LoginStyle.css";
import { rootStore } from "../../../stores/rootStore";
import authService from "../../../api/authService";
import { useNavigate } from "react-router-dom";
// import { observer } from "mobx-react-lite";


export const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "", 
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { authStore } = rootStore;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Для регистрации проверяем username
    if (!isLoginMode && !formData.username.trim()) {
      newErrors.username = "Имя пользователя обязательно";
    }
    
    // Email проверяем всегда
    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }
    
    // Пароль проверяем всегда
    if (!formData.password.trim()) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 8) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let response;
      if (isLoginMode) {
        response = await authService.login(formData.email, formData.password);
      } else {
        response = await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }

      console.log("Успех:", response);

      // Сохраняем данные аутентификации
      authStore.login({
        username: response.username,
        token: response.token,
        email: formData.email
      });

      setSuccessMessage(isLoginMode ? "Успешный вход!" : "Регистрация прошла успешно!");
      setErrorMessage("");
      navigate("/Profile"); // Перенаправляем на главную страницу

    } catch (error) {
      console.error("Ошибка:", error);
      setErrorMessage(
        error.response?.data?.message || 
        (isLoginMode ? "Ошибка входа" : "Ошибка регистрации")
      );
    }
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        username: 'chort',
        password: 'ваш_пароль'
      });
      
      localStorage.setItem('token', response.data.token);
      
      window.location.href = '/Profile';
    } catch (error) {
      console.error('Ошибка авторизации', error);
    }
  };
  

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLoginMode ? "Вход в систему" : "Создать аккаунт"}</h1>
          <p className="auth-subtitle">
            {isLoginMode 
              ? "Введите свои данные для входа" 
              : "Заполните форму для регистрации"}
          </p>
        </div>
  
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}
  
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <div className="input-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ваше имя"
                className={errors.username ? "input-error" : ""}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
          )}
  
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
  
          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Не менее 8 символов"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
  
          <button type="submit" className="primary-button">
            {isLoginMode ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
  
        <div className="auth-footer">
          <p>
            {isLoginMode ? "Ещё нет аккаунта?" : "Уже есть аккаунт?"}
            <button
              type="button"
              className="text-button"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? " Зарегистрироваться" : " Войти"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};