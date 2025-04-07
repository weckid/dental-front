import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminPanelStyle.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
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
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error(err);
        navigate("/login"); // Перенаправление при ошибке
      });
  }, [navigate]);

  return (
    <main>
      <div className="container">
        <section className="admin-panel">
          <div className="catalog_title">
            <div className="heading">
              <h1>Админ-панель: Пользователи</h1>
            </div>
          </div>
          <div className="content_cards">
            {users.map((user) => (
              <div key={user.id} className="catalog_card">
                <img
                  src={user.photoUrl || "/default-user.jpg"}
                  alt={user.username}
                  onError={(e) => (e.target.src = "/default-user.jpg")} 
                />
                <div className="text_card_catalog">
                  <h2>{user.username}</h2>
                  <p>Email: {user.email}</p>
                  <p>Роли: {user.roles.map((role) => role.name).join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPanel;