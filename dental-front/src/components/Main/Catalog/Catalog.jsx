import React, { useState } from "react";
import "./CatalogStyle.css";
import { Link } from "react-router-dom";

export const Catalog = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const cards = [
    {
      id: 1,
      category: "therapy",
      image: "/card.jpg",
      title: "Лечение кариеса",
      description: "Устранение кариозных поражений с установкой пломбы.",
      price: "1 500 ₽",
    },
    {
      id: 2,
      category: "therapy",
      image: "/card.jpg",
      title: "Лечение пульпита",
      description: "Лечение нерва зуба с последующим пломбированием каналов.",
      price: "3 500 ₽",
    },
    {
      id: 3,
      category: "therapy",
      image: "/card.jpg",
      title: "Лечение периодонтита",
      description: "Терапия воспаления тканей вокруг корней зубов.",
      price: "4 000 ₽",
    },
    {
      id: 4,
      category: "surgical",
      image: "/card.jpg",
      title: "Удаление зуба (простое)",
      description: "Безболезненное удаление зуба под местной анестезией.",
      price: "2 000 ₽",
    },
    {
        id: 5,
        category: "surgical",
        image: "/card.jpg",
        title: "Удаление зуба (сложное)",
        description: "Удаление ретинированных или дистопированных зубов.",
        price: "4 000 ₽",
      },
      {
        id: 6,
        category: "surgical",
        image: "/card.jpg",
        title: "Имплантация зуба",
        description: "Установка импланта с последующим протезированием.",
        price: "25 000 ₽",
      },
      {
        id: 7,
        category: "orthod",
        image: "/card.jpg",
        title: "Установка металлических брекетов",
        description: "Эффективное исправление прикуса с помощью классических брекетов.",
        price: "30 000 ₽",
      },
      {
        id: 8,
        category: "orthod",
        image: "/card.jpg",
        title: "Установка керамических брекетов",
        description: "Менее заметные брекеты для эстетичного лечения.",
        price: "40 000 ₽",
      },
      {
        id: 9,
        category: "orthod",
        image: "/card.jpg",
        title: "Коррекция прикуса",
        description: "Раннее исправление прикуса для предотвращения проблем в будущем.",
        price: "20 000 ₽",
      },
      {
        id: 10,
        category: "aesthet",
        image: "/card.jpg",
        title: "Профессиональное отбеливание",
        description: "Осветление зубов на несколько тонов за один визит.",
        price: "10 000 ₽",
      },
      {
        id: 11,
        category: "aesthet",
        image: "/card.jpg",
        title: "Установка виниров",
        description: "Тонкие накладки для идеальной улыбки.",
        price: "20 000 ₽",
      },
      {
        id: 12,
        category: "aesthet",
        image: "/card.jpg",
        title: "Микроабразия эмали",
        description: "Устранение поверхностных дефектов эмали.",
        price: "3 000 ₽",
      }
  ];

  const filteredCards = activeFilter === "All" 
    ? cards 
    : cards.filter((card) => card.category === activeFilter);

  return (
    <main>
      <div className="container">
        <section className="catalog">
          <div className="catalog_title">
            <div className="heading">
              <h1>Каталог</h1>
            </div>
            <ul className="list">
              <li
                className={activeFilter === "All" ? "active" : ""}
                onClick={() => handleFilterClick("All")}
              >
                Все
              </li>
              <li
                className={activeFilter === "therapy" ? "active" : ""}
                onClick={() => handleFilterClick("therapy")}
              >
                Терапевтическая стоматология
              </li>
              <li
                className={activeFilter === "surgical" ? "active" : ""}
                onClick={() => handleFilterClick("surgical")}
              >
                Хирургическая стоматология
              </li>
              <li
                className={activeFilter === "orthod" ? "active" : ""}
                onClick={() => handleFilterClick("orthod")}
              >
                Лечение и реабилитация
              </li>
              <li
                className={activeFilter === "aesthet" ? "active" : ""}
                onClick={() => handleFilterClick("aesthet")}
              >
                Эстетическая стоматология
              </li>
            </ul>
          </div>
          <div className="content_cards">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className={`catalog_card All ${card.category}`}
              >
                <img src={card.image} alt={card.title} />
                <div className="text_card_catalog">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <h3>{card.price}</h3>
                  <div className="button_card">
                    <Link to="/Entry">Записаться на прием</Link>
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