import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ISauna } from "../models/SaunaInterfaces";
import "./FrontPage.css";
import { getCurrentWeekday } from "../common/Utils";

const FrontPage: React.FC = () => {
  const [saunas, setSaunas] = useState<ISauna[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/sauna/list")
      .then((response) => response.json())
      .then((data) => setSaunas(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    // Restore scroll position when the component mounts
    const savedScrollPosition = localStorage.getItem("scrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
  }, []);

  const handleCardClick = (id: string) => {
    localStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate(`/sauna/${id}`);
  };

  const handleRandomClick = () => {
    localStorage.setItem("scrollPosition", window.scrollY.toString());
    const randomSaunaId: string =
      saunas[Math.floor(Math.random() * saunas.length)].id;
    navigate("/sauna/" + randomSaunaId);
  };

  const currentWeekday = getCurrentWeekday();

  return (
    <div className="root">
      <div className="header-content">
        <img src="/saunahaku.png" alt="Sauna" className="logo" />
      </div>
      <div className="center-content">
        {saunas.map((sauna: ISauna, index) => (
          <div
            key={index}
            className="card"
            onClick={() => handleCardClick(sauna.id)}
          >
            <img src="/sauna.png" alt="Sauna" className="card-image" />
            <h3>{sauna.name}</h3>
            <p>{sauna.streetAddress}</p>
            <p>{sauna.postalCode}</p>
            <p>{sauna.city}</p>
            {sauna.openingHours.find((oh) => oh.weekday === currentWeekday) !==
            undefined ? (
              <div className="open_today">Avoinna tänään</div>
            ) : (
              <div className="closed_today">Suljettu tänään</div>
            )}
          </div>
        ))}
        <p>
          <button onClick={handleRandomClick} className="random-button">
            <img src="/random2.png" alt="Random" className="random-image" />
            <div className="overlay-text">RANDOM SAUNA</div>
          </button>
        </p>
      </div>
      <br />
      <p>
        Copyright (c) SaunaHaku 2024
        <br />
        Kaikki oikeudet pidätetään
      </p>
    </div>
  );
};

export default FrontPage;
