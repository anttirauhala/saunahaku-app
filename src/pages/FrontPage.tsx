import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ISauna } from "../models/SaunaInterfaces";
import "./FrontPage.css";
import { getCurrentWeekday, isNewSauna } from "../common/Utils";

const FrontPage: React.FC = () => {
  const [saunas, setSaunas] = useState<ISauna[]>([]);
  const navigate = useNavigate();
  const currentWeekday = getCurrentWeekday();
  const srv = import.meta.env.VITE_BACKEND_HOST;
  const port = import.meta.env.VITE_BACKEND_PORT;
  const apiPath = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    fetch(
      `${srv}${port ? ":" + port : ""}${
        apiPath ? apiPath + "/list" : ""
      }`
    )
      .then((response) => response.json())
      .then((data) => setSaunas(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [srv]);

  useEffect(() => {
    // Restore scroll position when the component mounts
    const savedScrollPosition = localStorage.getItem("scrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleCardClick = (id: string) => {
    // Save scroll position before navigating to the details page
    localStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate(`/sauna/${id}`);
  };

  const handleRandomClick = () => {
    // Save scroll position before navigating to the details page
    localStorage.setItem("scrollPosition", window.scrollY.toString());
    const randomSaunaId: string =
      saunas[Math.floor(Math.random() * saunas.length)].id;
    navigate("/sauna/" + randomSaunaId);
  };

  return (
    <div>
      <div className="header-content">
        <img src="/saunahaku.png" alt="Saunahaku image" className="logo" />
      </div>
      <div className="center-content">
        {saunas.map((sauna: ISauna, index) =>
          saunaCard(index, handleCardClick, sauna, currentWeekday)
        )}
        <div className="random-container">
          <button onClick={handleRandomClick} className="random-button">
            <img src="/random2.png" alt="Random" className="random-image" />
            <div className="overlay-text">RANDOM SAUNA</div>
          </button>
        </div>
      </div>
      <br />
      <p>
        Copyright (c) SaunaHaku 2024
        <br />
        Kaikki oikeudet pidätetään
        <br />
        <img src="/saunahaku_email.png" alt="" className="bottom-image" />
      </p>
    </div>
  );
};

export default FrontPage;

const saunaCard = (
  index: number,
  handleCardClick: (id: string) => void,
  sauna: ISauna,
  currentWeekday: string
) => {
  return (
    <div
      key={"card_" + index}
      className="card"
      onClick={() => handleCardClick(sauna.id)}
    >
      <img src="/sauna.png" alt="Sauna" className="card-image" />
      {isNewSauna(sauna.id) && <img src="/uusi3.jpg" alt="Uusi" className="new-image" />}
      <h3>{sauna.name}</h3>
      <p className="hide-on-mobile">{sauna.streetAddress}</p>
      <p className="hide-on-mobile">{sauna.postalCode}</p>
      <p>{sauna.city}</p>
      {sauna.openingHours.find((oh) => oh.weekday === currentWeekday) !==
      undefined ? (
        <div className="open_today">Avoinna tänään</div>
      ) : (
        <div className="closed_today">Suljettu tänään</div>
      )}
    </div>
  );
};
