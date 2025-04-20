import React, { useState, useEffect } from "react";
import "./CatalogStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { rootStore } from "../../../stores/rootStore";

export const Catalog = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    categoryCode: "All",
  });
  const [newCategory, setNewCategory] = useState({
    code: "",
    name: "",
  });
  const [priceError, setPriceError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const navigate = useNavigate();
  const { authStore } = rootStore;

  // Функция для форматирования цены с пробелами
  const formatPrice = (price) => {
    if (!price) return "";
    const [integerPart, decimalPart] = price.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

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

  const handleDeleteCategory = (code) => {
    if (window.confirm("Вы уверены, что хотите удалить категорию? Все связанные услуги также будут удалены.")) {
      fetch(`http://localhost:8080/api/categories/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token || localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setCategories(categories.filter((cat) => cat.code !== code));
            setCards(cards.filter((card) => card.categoryCode !== code));
            if (activeFilter === code) {
              setActiveFilter("All");
            }
            alert("Категория и связанные услуги удалены");
          } else {
            throw new Error("Ошибка удаления категории");
          }
        })
        .catch((err) => {
          console.error("Ошибка удаления категории:", err);
          alert("Не удалось удалить категорию");
        });
    }
  };

  const handleEdit = (cardId) => {
    navigate(`/edit-card/${cardId}`);
  };

  const handleAddCard = () => {
    setIsModalOpen(true);
  };

  const handleAddCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewCard({ title: "", description: "", price: "", image: null, categoryCode: "All" });
    setPriceError("");
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
    setNewCategory({ code: "", name: "" });
    setCategoryError("");
  };

  const handleNewCardChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "price") {
      const isValidPrice = /^[0-9]*\.?[0-9]{0,2}$/.test(value) || value === "";
      if (!isValidPrice) {
        setPriceError("Цена должна быть числом (например, 1500 или 1500.99)");
        return;
      }
      setPriceError("");
      setNewCard((prev) => ({ ...prev, price: value }));
    } else if (name === "image") {
      setNewCard((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewCard((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewCardSubmit = async (e) => {
    e.preventDefault();
    if (priceError || !newCard.price) {
      alert("Исправьте цену перед сохранением");
      return;
    }
    if (!authStore.isAuth || !authStore.token) {
      alert("Вы не авторизованы");
      return;
    }

    const formData = new FormData();
    formData.append("title", newCard.title);
    formData.append("description", newCard.description);
    formData.append("price", newCard.price);
    if (newCard.image) {
      formData.append("image", newCard.image);
    }
    formData.append("categoryCode", newCard.categoryCode);

    console.log("FormData:", [...formData.entries()]);

    try {
      const response = await fetch("http://localhost:8080/api/cards", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token || localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка добавления карточки: ${errorText}`);
      }
      const data = await response.json();
      console.log("Ответ сервера:", data);
      setCards([...cards, data]);
      handleModalClose();
      alert("Карточка добавлена");
    } catch (err) {
      console.error("Ошибка добавления карточки:", err);
      alert(`Не удалось добавить карточку: ${err.message}`);
    }
  };

  const handleNewCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.code || !newCategory.name) {
      setCategoryError("Код и название категории обязательны");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(newCategory.code)) {
      setCategoryError("Код должен содержать только латинские буквы и цифры");
      return;
    }
    if (!authStore.isAuth || !authStore.token) {
      alert("Вы не авторизованы");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token || localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка добавления категории: ${errorText}`);
      }
      const data = await response.json();
      console.log("Категория создана:", data);
      setCategories([...categories, data]);
      handleCategoryModalClose();
      alert("Категория добавлена");
    } catch (err) {
      console.error("Ошибка добавления категории:", err);
      alert(`Не удалось добавить категорию: ${err.message}`);
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
    >
      <span onClick={() => handleFilterClick(cat.code)}>{cat.name}</span>
      {isAdmin && (
        <button
          className="delete-category-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCategory(cat.code);
          }}
          title="Удалить категорию"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="16" 
            height="16" 
            fill="currentColor"
            style={{ display: 'block' }}
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </li>
  ))}
</ul>
            {isAdmin && (
              <div className="add-card-section">
                <button className="add-btn" onClick={handleAddCard}>
                  Добавить карточку
                </button>
                <button className="add-btn" onClick={handleAddCategory}>
                  Добавить категорию
                </button>
              </div>
            )}
          </div>
          <div className="content_cards">
            {cards.length > 0 ? (
              cards.map((card) => (
                <div
                  key={card.id}
                  className={`catalog_card All ${card.categoryCode}`}
                >
                  <div className="image_container">
                    <img
                      src={card.image}
                      alt={card.title}
                      onError={(e) => {
                        console.error(`Failed to load image: ${card.image}`);
                        e.target.src = "http://localhost:5173/default.jpg";
                      }}
                      onLoad={() => console.log(`Image loaded: ${card.image}`)}
                    />
                  </div>
                  <div className="text_card_catalog">
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                    <h3>
                      {formatPrice(card.price)} <span className="ruble-sign">₽</span>
                    </h3>
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
              ))
            ) : (
              <p>Карточки отсутствуют</p>
            )}
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
                    placeholder="Введите название услуги"
                  />
                </label>
                <label>
                  Описание:
                  <textarea
                    name="description"
                    value={newCard.description}
                    onChange={handleNewCardChange}
                    required
                    placeholder="Опишите услугу"
                  />
                </label>
                <label>
                  Цена:
                  <div className="price-input-wrapper">
                    <input
                      type="text"
                      name="price"
                      value={newCard.price}
                      onChange={handleNewCardChange}
                      required
                      pattern="[0-9]*\.?[0-9]{0,2}"
                      placeholder="1500.00"
                    />
                    <span className="ruble-sign">₽</span>
                  </div>
                  {priceError && <p className="error">{priceError}</p>}
                </label>
                <label>
                  Изображение:
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleNewCardChange}
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

        {isCategoryModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Добавить новую категорию</h2>
              <form onSubmit={handleNewCategorySubmit}>
                <label>
                  Код категории:
                  <input
                    type="text"
                    name="code"
                    value={newCategory.code}
                    onChange={handleNewCategoryChange}
                    required
                    placeholder="например, ortho"
                  />
                </label>
                <label>
                  Название категории:
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleNewCategoryChange}
                    required
                    placeholder="например, Ортодонтия"
                  />
                </label>
                {categoryError && <p className="error">{categoryError}</p>}
                <div className="modal-actions">
                  <button type="submit">Сохранить</button>
                  <button type="button" onClick={handleCategoryModalClose}>
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