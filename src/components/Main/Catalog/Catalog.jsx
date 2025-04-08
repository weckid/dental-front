import React, { useState, useEffect } from "react";
import "./CatalogStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { rootStore } from "../../../stores/rootStore"; // Импортируем rootStore

export const Catalog = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { authStore } = rootStore; // Получаем authStore

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Ошибка загрузки категорий:", err));

    fetch(`http://localhost:8080/api/cards?category=${activeFilter}`, {
      headers: {
        Authorization: `Bearer ${authStore.token || localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error("Ошибка загрузки карточек:", err));
  }, [activeFilter, authStore.token]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDelete = (cardId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту услугу?")) {
      fetch(`http://localhost:8080/api/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token || localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setCards(cards.filter((card) => card.id !== cardId));
            alert("Услуга удалена");
          } else {
            throw new Error("Ошибка удаления");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Не удалось удалить услугу");
        });
    }
  };

  const handleEdit = (cardId) => {
    navigate(`/edit-card/${cardId}`); // Перенаправляем на страницу редактирования
  };

  // Проверяем, является ли пользователь администратором
  const isAdmin = authStore.isAuth && authStore.roles.includes("ROLE_ADMIN");

  return (
    <main>
      <div className="container">
        <section className="catalog">
          <div className="catalog_title">
            <div className="heading">
              <h1>Каталог услуг</h1>
            </div>
            <ul className="list">
              {categories.map((cat) => (
                <li
                  key={cat.code}
                  className={activeFilter === cat.code ? "active" : ""}
                  onClick={() => handleFilterClick(cat.code)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="content_cards">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`catalog_card All ${card.categoryCode}`}
              >
                <img src={card.image} alt={card.title} />
                <div className="text_card_catalog">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <h3>{card.price}</h3>
                  <div className="button_card">
                    <Link to="/Entry">Записаться на прием</Link>
                    {isAdmin && (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(card.id)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(card.id)}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};