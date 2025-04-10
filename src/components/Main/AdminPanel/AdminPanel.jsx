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
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('XSRF-TOKEN='));
    return cookie ? cookie.split('=')[1] : null;
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
    })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          throw new Error("Доступ запрещён");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((err) => {
        console.error(err);
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

  const handleDelete = (userId) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      const token = localStorage.getItem("token");
      const csrfToken = getCsrfToken();

      fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-XSRF-TOKEN": csrfToken,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(`Ошибка ${res.status}: ${text || res.statusText}`);
            });
          }
          const updatedUsers = users.filter((user) => user.id !== userId);
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          alert("Пользователь успешно удалён");
        })
        .catch((err) => {
          console.error("Ошибка удаления:", err);
          alert("Ошибка при удалении пользователя: " + err.message);
        });
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
              filteredUsers.map((user) => (
                <div key={user.id} className="admin-user-card">
                <img
                   src={user.photoUrl || "/anonymous.jpg"}
                   alt={user.username}
                   onError={(e) => (e.target.src = "/anonymous.jpg")}
                />
                  <div className="admin-user-info">
                    <h2>{user.username}</h2>
                    <p>Email: {user.email}</p>
                    <p>Роли: {user.roles.map((role) => role.name).join(", ")}</p>
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
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