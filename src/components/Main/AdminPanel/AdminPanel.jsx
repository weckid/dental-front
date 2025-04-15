import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminPanelStyle.css";

const anonymousAvatar = "/anonymous.jpg";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Функция для получения CSRF-токена из куки
  const getCsrfToken = () => {
    const cookie = document.cookie.split(";").find(c => c.trim().startsWith("XSRF-TOKEN="));
    const token = cookie ? cookie.split("=")[1] : null;
    console.log("CSRF-токен из куки:", token);
    return token;
  };

  // Получение CSRF-токена через API
  const fetchCsrfToken = async () => {
    try {
      console.log("Запрос CSRF-токена");
      const response = await fetch("http://localhost:8080/api/csrf", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status}`);
      }
      const token = response.headers.get("X-XSRF-TOKEN") || getCsrfToken();
      console.log("CSRF-токен через API:", token);
      return token;
    } catch (err) {
      console.error("Ошибка получения CSRF:", err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          throw new Error("Доступ запрещён");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Полученные пользователи:", data);
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки пользователей:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId) => {
    console.log("Попытка удалить ID:", userId);
    console.log("Перед вызовом confirm");
    try {
      const confirmed = window.confirm("Вы уверены, что хотите удалить этого пользователя?");
      console.log("Результат confirm:", confirmed);
      if (confirmed) {
        console.log("Подтверждено удаление ID:", userId);
        const token = localStorage.getItem("token");
        let csrfToken = getCsrfToken();

        if (!csrfToken) {
          console.log("CSRF-токен отсутствует, запрашиваем");
          csrfToken = await fetchCsrfToken();
        }

        console.log("Токен:", token, "CSRF:", csrfToken);

        if (!token) {
          console.error("Токен отсутствует");
          alert("Ошибка: Токен авторизации отсутствует");
          return;
        }

        if (!csrfToken) {
          console.error("CSRF-токен не получен");
          alert("Ошибка: Не удалось получить CSRF-токен");
          return;
        }

        console.log("Отправка DELETE с заголовками:", {
          Authorization: `Bearer ${token}`,
          "X-XSRF-TOKEN": csrfToken,
        });

        const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": csrfToken,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("Ответ сервера:", response.status, response.statusText);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Ошибка ${response.status}: ${text || response.statusText}`);
        }

        console.log("Удаление успешно");
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        alert("Пользователь успешно удалён");
      } else {
        console.log("Удаление отменено");
      }
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert("Ошибка при удалении пользователя: " + err.message);
    }
  };

  return (
    <main>
      <div className="admin-container">
        <section className="admin-panel-section">
          <div className="admin-title">
            <div className="admin-heading">
              <h1>Админ-панель: Пользователи</h1>
            </div>
          </div>
          <div className="admin-search-section">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={handleSearch}
              className="admin-search-input"
            />
          </div>
          <div className="admin-users-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isAdmin = user.roles && Array.isArray(user.roles) && user.roles.some((role) => role.name && (role.name === "ROLE_ADMIN" || role.name === "ADMIN"));
                return (
                  <div key={user.id} className="admin-user-card">
                    <img
                      src={user.photoUrl || anonymousAvatar}
                      alt={user.username}
                      onError={(e) => (e.target.src = anonymousAvatar)}
                    />
                    <div className="admin-user-info">
                      <h2>{user.username}</h2>
                      <p>Email: {user.email}</p>
                      <p>Роли: {user.roles && user.roles.length > 0 ? user.roles.map((role) => role.name).join(", ") : "Нет ролей"}</p>
                      {!isAdmin && (
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDelete(user.id)}
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="admin-no-users">Пользователи не найдены</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPanel;