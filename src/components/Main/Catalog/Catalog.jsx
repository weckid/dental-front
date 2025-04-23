import React, { useState, useEffect } from "react";
import "./CatalogStyle.css";
import { useNavigate } from "react-router-dom";
import { rootStore } from "../../../stores/rootStore";
import apiClient from "../../../api/apiClient";

const BASE_URL = "http://localhost:8080";
const defaultImage = "http://localhost:5173/default.jpg";

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

  // Проверка, является ли пользователь доктором или админом
  const isDoctorOrAdmin = authStore.roles.includes("ROLE_DOCTOR") || authStore.roles.includes("ROLE_ADMIN");

  const formatPrice = (price) => {
    if (!price) return "";
    const [integerPart, decimalPart] = price.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  const getImageUrl = (image) => {
    if (!image) {
      console.log("Изображение отсутствует, используется defaultImage");
      return defaultImage;
    }
    let normalizedImage = image.replace(/(http:\/\/localhost:8080)+/, "");
    normalizedImage = normalizedImage.replace(/^\/+/, "");
    if (!normalizedImage.startsWith("Uploads/cards/")) {
      normalizedImage = `Uploads/cards/${normalizedImage}`;
    }
    const fullUrl = `${BASE_URL}/${normalizedImage}`;
    console.log("Формируем URL изображения:", fullUrl);
    return fullUrl;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await apiClient.get("/categories");
        console.log("Категории:", categoriesResponse.data);
        setCategories(categoriesResponse.data);

        const cardsResponse = await apiClient.get("/cards", {
          params: { category: activeFilter },
        });
        console.log("Карточки:", cardsResponse.data);
        setCards(cardsResponse.data);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        alert("Не удалось загрузить данные: " + (err.response?.data?.message || err.message));
      }
    };

    fetchData();
  }, [activeFilter]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту услугу?")) return;

    try {
      await apiClient.delete(`/cards/${cardId}`);
      setCards(cards.filter((card) => card.id !== cardId));
      alert("Услуга удалена");
    } catch (err) {
      console.error("Ошибка удаления карточки:", err);
      alert("Не удалось удалить услугу: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCategory = async (code) => {
    if (!window.confirm("Вы уверены, что хотите удалить категорию? Все связанные услуги также будут удалены.")) return;

    try {
      await apiClient.delete(`/categories/${code}`);
      setCategories(categories.filter((cat) => cat.code !== code));
      setCards(cards.filter((card) => card.categoryCode !== code));
      if (activeFilter === code) {
        setActiveFilter("All");
      }
      alert("Категория и связанные услуги удалены");
    } catch (err) {
      console.error("Ошибка удаления категории:", err);
      alert("Не удалось удалить категорию: " + (err.response?.data?.message || err.message));
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
      const file = files[0];
      if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setNewCard((prev) => ({ ...prev, image: file }));
      } else {
        alert("Пожалуйста, выберите файл формата PNG, JPEG или JPG");
      }
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
    if (!authStore.isAuth) {
      alert("Вы не авторизованы");
      navigate("/Login");
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

    try {
      const response = await apiClient.post("/cards", formData);
      setCards([...cards, response.data]);
      handleModalClose();
      alert("Карточка добавлена");
    } catch (err) {
      console.error("Ошибка добавления карточки:", err);
      alert("Не удалось добавить карточку: " + (err.response?.data?.message || err.message));
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
    if (!authStore.isAuth) {
      alert("Вы не авторизованы");
      navigate("/Login");
      return;
    }

    try {
      const response = await apiClient.post("/categories", newCategory);
      setCategories([...categories, response.data]);
      handleCategoryModalClose();
      alert("Категория добавлена");
    } catch (err) {
      console.error("Ошибка добавления категории:", err);
      alert("Не удалось добавить категорию: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBookAppointment = async (cardId) => {
    if (!authStore.isAuth) {
      alert("Пожалуйста, войдите в аккаунт для записи на приём");
      navigate("/Login");
      return;
    }

    if (isDoctorOrAdmin) {
      alert("Запись доступна только пациентам.");
      return;
    }

    try {
      console.log("Sending appointment request with cardId:", cardId);
      const response = await apiClient.post("/appointments", { cardId });
      navigate(`/appointment/${response.data.id}`, { state: { appointment: response.data } });
    } catch (err) {
      console.error("Ошибка создания заявки:", err.response?.data || err.message);
      alert(`Не удалось создать заявку: ${err.response?.data?.message || err.message}`);
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
                        style={{ display: "block" }}
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
                      src={getImageUrl(card.image)}
                      alt={card.title}
                      onError={(e) => {
                        console.error(`Failed to load image: ${card.image}, URL: ${getImageUrl(card.image)}`);
                        e.target.src = defaultImage;
                      }}
                      onLoad={() => console.log(`Image loaded: ${card.image}, URL: ${getImageUrl(card.image)}`)}
                    />
                  </div>
                  <div className="text_card_catalog">
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                    <h3>
                      {formatPrice(card.price)} <span className="ruble-sign">₽</span>
                    </h3>
                    <div className="button_card">
                      {isDoctorOrAdmin ? (
                        <p className="access-denied">Запись доступна только пациентам.</p>
                      ) : (
                        <button
                          className="book-btn"
                          onClick={() => handleBookAppointment(card.id)}
                        >
                          Записаться на приём
                        </button>
                      )}
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