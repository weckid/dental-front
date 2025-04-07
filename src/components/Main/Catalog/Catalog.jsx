import React, { useState, useEffect } from "react";
import "./CatalogStyle.css";
import { Link } from "react-router-dom";

export const Catalog = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch(`http://localhost:8080/api/cards?category=${activeFilter}`)
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, [activeFilter]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

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