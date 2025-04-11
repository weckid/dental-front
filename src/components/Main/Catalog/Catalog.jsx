import React, { useState, useEffect } from "react";
import "./CatalogStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { rootStore } from "../../../stores/rootStore";

export const Catalog = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    price: "",
    image: null, // Теперь image будет файлом, а не строкой
    categoryCode: "All",
  });
  const navigate = useNavigate();
  const { authStore } = rootStore;

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
    navigate(`/edit-card/${cardId}`);
  };

  const handleAddCard = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewCard({ title: "", description: "", price: "", image: null, categoryCode: "All" });
  };

  const handleNewCardChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewCard((prev) => ({ ...prev, image: files[0] })); // Сохраняем файл
    } else {
      setNewCard((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNewCardSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newCard.title);
    formData.append("description", newCard.description);
    formData.append("price", newCard.price);
    if (newCard.image) {
      formData.append("image", newCard.image); // Отправляем файл
    }
    formData.append("categoryCode", newCard.categoryCode);

    console.log("Токен для POST:", authStore.token || localStorage.getItem("token")); // Отладка токена
    try {
      const response = await fetch("http://localhost:8080/api/cards", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token || localStorage.getItem("token")}`,
        },
        body: formData, // Отправляем FormData вместо JSON
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка добавления карточки: ${errorText}`);
      }
      const data = await response.json();
      setCards([...cards, data]);
      handleModalClose();
      alert("Карточка добавлена");
    } catch (err) {
      console.error(err);
      alert("Не удалось добавить карточку");
    }
  };

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
            {isAdmin && (
              <div className="add-card-section">
                <button className="add-btn" onClick={handleAddCard}>
                  Добавить карточку
                </button>
              </div>
            )}
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

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Добавить новую карточку</h2>
              <form onSubmit={handleNewCardSubmit}>
                <label>
                  Название:
                  <input
                    type="text"
                    name="title"
                    value={newCard.title}
                    onChange={handleNewCardChange}
                    required
                  />
                </label>
                <label>
                  Описание:
                  <textarea
                    name="description"
                    value={newCard.description}
                    onChange={handleNewCardChange}
                    required
                  />
                </label>
                <label>
                  Цена:
                  <input
                    type="text"
                    name="price"
                    value={newCard.price}
                    onChange={handleNewCardChange}
                    required
                  />
                </label>
                <label>
                  Изображение:
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/jpg" // Ограничение на форматы
                    onChange={handleNewCardChange}
                    required
                  />
                </label>
                <label>
                  Категория:
                  <select
                    name="categoryCode"
                    value={newCard.categoryCode}
                    onChange={handleNewCardChange}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories
                      .filter((cat) => cat.code !== "All")
                      .map((cat) => (
                        <option key={cat.code} value={cat.code}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </label>
                <div className="modal-actions">
                  <button type="submit">Сохранить</button>
                  <button type="button" onClick={handleModalClose}>
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};