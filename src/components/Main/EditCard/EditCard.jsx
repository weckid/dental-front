import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rootStore } from "../../../stores/rootStore";
import "./EditCardStyle.css";

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
  const [priceError, setPriceError] = useState(""); // Для валидации цены
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!authStore.isAuth || !authStore.token) {
        setError("Вы не авторизованы");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Токен для GET:", authStore.token);
        const response = await fetch(`http://localhost:8080/api/cards/${id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Не удалось загрузить данные карточки: ${errorText}`);
        }
        const data = await response.json();
        setCard(data);
      } catch (err) {
        console.error("Ошибка загрузки карточки:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, authStore.token, authStore.isAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const isValidPrice = /^[0-9]*\.?[0-9]{0,2}$/.test(value) || value === "";
      if (!isValidPrice) {
        setPriceError("Цена должна быть числом");
        return;
      }
      setPriceError("");
    }
    setCard({ ...card, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (priceError || !card.price) {
      alert("Исправьте цену перед сохранением");
      return;
    }
    if (!authStore.isAuth || !authStore.token) {
      setError("Вы не авторизованы");
      return;
    }

    try {
      console.log("Токен для PUT:", authStore.token);
      console.log("Отправляемые данные:", card);
      const response = await fetch(`http://localhost:8080/api/cards/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Не удалось обновить карточку: ${errorText}`);
      }
      navigate("/Catalog");
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate("/Catalog")}>Вернуться к каталогу</button>
      </div>
    );
  }

  return (
    <div className="edit-card-container">
      <h1>Редактировать услугу</h1>
      <form onSubmit={handleSubmit} className="edit-card-form">
        <div className="form-group">
          <label>Название</label>
          <input
            name="title"
            value={card.title}
            onChange={handleChange}
            placeholder="Название"
          />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea
            name="description"
            value={card.description}
            onChange={handleChange}
            placeholder="Описание"
          />
        </div>
        <div className="form-group">
          <label>Цена</label>
          <div className="price-input-wrapper">
            <input
              name="price"
              value={card.price}
              onChange={handleChange}
              placeholder="1500.00"
              pattern="[0-9]*\.?[0-9]{0,2}"
            />
            <span className="ruble-sign">₽</span>
          </div>
          {priceError && <p className="error">{priceError}</p>}
        </div>
        <div className="form-group">
          <label>URL изображения</label>
          <input
            name="image"
            value={card.image}
            onChange={handleChange}
            placeholder="URL изображения"
          />
        </div>
        <div className="form-group">
          <label>Код категории</label>
          <input
            name="categoryCode"
            value={card.categoryCode}
            onChange={handleChange}
            placeholder="Код категории"
          />
        </div>
        <button type="submit" className="save-btn">Сохранить</button>
        <button type="button" className="cancel-btn" onClick={() => navigate("/Catalog")}>
          Отмена
        </button>
      </form>
    </div>
  );
};

export default EditCard;