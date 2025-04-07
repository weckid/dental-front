import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminPanelStyle.css";

const anonymousAvatar = "/anonymous.jpg";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
        setFilteredUsers(data); // Изначально показываем всех пользователей
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  // Обработка поиска
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

  return (
    <main>
      <div className="container">
        <section className="admin-panel">
          <div className="catalog_title">
            <div className="heading">
              <h1>Админ-панель: Пользователи</h1>
            </div>
          </div>

          {/* Секция поиска */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          {/* Список пользователей */}
          <div className="content_cards">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="catalog_card">
                  <img
                    src={user.photoUrl || "/anonymous.jpg"}
                    alt={user.username}
                    onError={(e) => (e.target.src = "/anonymous.jpg")}
                  />
                  <div className="text_card_catalog">
                    <h2>{user.username}</h2>
                    <p>Email: {user.email}</p>
                    <p>Роли: {user.roles.map((role) => role.name).join(", ")}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-users">Пользователи не найдены</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPanel;