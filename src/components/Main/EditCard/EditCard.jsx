
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rootStore } from "../../../stores/rootStore";
import apiClient from "../../../api/apiClient";
import "./EditCardStyle.css";

const BASE_URL = "http://localhost:8080";

const EditCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authStore } = rootStore;
  const [card, setCard] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    categoryCode: "",
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [priceError, setPriceError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authStore.isAuth || !authStore.token) {
        console.log("Не авторизован: isAuth =", authStore.isAuth, "token =", authStore.token);
        setError("Вы не авторизованы");
        setLoading(false);
        return;
      }

      try {
        console.log("Начало загрузки данных для карточки ID:", id);
        // Загрузка карточки
        const cardResponse = await apiClient.get(`/cards/${id}`);
        console.log("Ответ GET /api/cards/", id, ":", cardResponse.data);
        const cardData = cardResponse.data;
        setCard(cardData);

        // Загрузка категорий
        const categoriesResponse = await apiClient.get("/categories");
        console.log("Ответ GET /api/categories:", categoriesResponse.data);
        const filteredCategories = categoriesResponse.data.filter(
          (category) => category.code !== "All"
        );
        setCategories(filteredCategories);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.statusText ||
          err.message ||
          "Не удалось загрузить данные";
        setError(errorMessage);
      } finally {
        console.log("Завершение загрузки, loading = false");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, authStore.isAuth, authStore.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const isValidPrice = /^[0-9]*\.?[0-9]{0,2}$/.test(value) || value === "";
      if (!isValidPrice) {
        setPriceError("Цена должна быть числом с двумя знаками после запятой");
        return;
      }
      setPriceError("");
    }
    setCard({ ...card, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImageFile(file);
    } else {
      setImageFile(null);
      alert("Пожалуйста, выберите файл формата PNG, JPEG или JPG");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (priceError || !card.price) {
      setError("Исправьте цену перед сохранением");
      return;
    }
    if (!authStore.isAuth || !authStore.token) {
      setError("Вы не авторизованы");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", card.title);
      formData.append("description", card.description);
      formData.append("price", card.price);
      formData.append("categoryCode", card.categoryCode);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      console.log("Отправляемые данные:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await apiClient.put(`/cards/${id}`, formData);
      console.log("Карточка успешно обновлена, переход в /Catalog");
      navigate("/Catalog");
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Ошибка при обновлении карточки";
      setError(errorMessage);
    }
  };

  if (loading) {
    return <div className="edit-card-loading">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="edit-card-error">
        <p>{error}</p>
        <button onClick={() => navigate("/Catalog")}>Вернуться к каталогу</button>
      </div>
    );
  }

  return (
    <div className="edit-card-container">
      <h1>Редактировать услугу</h1>
      <form onSubmit={handleSubmit} className="edit-card-form">
        <div className="edit-card-form-group">
          <label>Название</label>
          <input
            name="title"
            value={card.title}
            onChange={handleChange}
            placeholder="Название услуги"
            required
          />
        </div>
        <div className="edit-card-form-group">
          <label>Описание</label>
          <textarea
            name="description"
            value={card.description}
            onChange={handleChange}
            placeholder="Описание услуги"
            required
          />
        </div>
        <div className="edit-card-form-group">
          <label>Цена (₽)</label>
          <div className="edit-card-price-input-wrapper">
            <input
              name="price"
              value={card.price}
              onChange={handleChange}
              placeholder="1500.00"
              pattern="[0-9]*\.?[0-9]{0,2}"
              required
            />
            <span className="edit-card-ruble-sign">₽</span>
          </div>
          {priceError && <p className="edit-card-error-message">{priceError}</p>}
        </div>
        <div className="edit-card-form-group">
          <label>Категория</label>
          <select
            name="categoryCode"
            value={card.categoryCode}
            onChange={handleChange}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="edit-card-form-group">
          <label>Изображение (PNG, JPEG, JPG)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
          />
        </div>
        <div className="edit-card-form-actions">
          <button type="submit" className="edit-card-save-btn" disabled={!!priceError}>
            Сохранить
          </button>
          <button
            type="button"
            className="edit-card-cancel-btn"
            onClick={() => navigate("/Catalog")}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCard;
