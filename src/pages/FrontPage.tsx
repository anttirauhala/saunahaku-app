import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ISauna } from "../models/SaunaInterfaces";
import "./FrontPage.css";
import { getCurrentWeekday, isNewSauna } from "../common/Utils";

const FrontPage: React.FC = () => {
  const [saunas, setSaunas] = useState<ISauna[]>([]);
  const [sortCriteria, setSortCriteria] = useState<string>(localStorage.getItem("sortCriteria") || "alphabetical");
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
    navigate(`/sauna/${randomSaunaId}`);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortCriteria = event.target.value;
    setSortCriteria(newSortCriteria);
    localStorage.setItem("sortCriteria", newSortCriteria);
  };

  const sortedSaunas = saunas.sort((a, b) => {
    if (sortCriteria === "latest") {
      const aClosingTimes = a.openingHours.filter((oh) => oh.weekday === currentWeekday).map((oh) => oh.closingTime);
      const bClosingTimes = b.openingHours.filter((oh) => oh.weekday === currentWeekday).map((oh) => oh.closingTime);
      const aLatestClosingTime = aClosingTimes.length > 0 ? Math.max(...aClosingTimes.map(time => parseInt(time.replace(':', ''), 10))) : 0;
      const bLatestClosingTime = bClosingTimes.length > 0 ? Math.max(...bClosingTimes.map(time => parseInt(time.replace(':', ''), 10))) : 0;
      return bLatestClosingTime - aLatestClosingTime;
    } else if (sortCriteria === "cheapest") {
      const getLatestPrice = (sauna: ISauna) => {
        const todayOpenings = sauna.openingHours.filter((oh) => oh.weekday === currentWeekday);
        if (todayOpenings.length === 0) return Infinity;
        const latestOpening = todayOpenings.reduce((latest, current) => {
          const latestTime = parseInt(latest.closingTime.replace(':', ''), 10);
          const currentTime = parseInt(current.closingTime.replace(':', ''), 10);
          return currentTime > latestTime ? current : latest;
        });
        return Math.min(...latestOpening.prices.filter((p) => p.priceType === "ADULT").map((p) => p.price));
      };
      const aPrice = getLatestPrice(a);
      const bPrice = getLatestPrice(b);
      if (aPrice !== bPrice) return aPrice - bPrice;
    }
    if (a.openingHours.some((oh) => oh.weekday === currentWeekday) && !b.openingHours.some((oh) => oh.weekday === currentWeekday)) {
      return -1;
    } else if (!a.openingHours.some((oh) => oh.weekday === currentWeekday) && b.openingHours.some((oh) => oh.weekday === currentWeekday)) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="header-content">
        <img src="/saunahaku.png" alt="Saunahaku image" className="logo" />
      </div>
      <div className="sort-container">
        <label>
          <select value={sortCriteria} onChange={handleSortChange}>
            <option value="alphabetical">Aakkosjärjestys</option>
            <option value="latest">Myöhäisimpään auki</option>
            <option value="cheapest">Halvimmasta kalleimpaan</option>
          </select>
        </label>
      </div>
      <i>Saunojen tiedot päivitetty 31.8.2025</i>
      <div className="center-content">
        {sortedSaunas.map((sauna: ISauna, index) =>
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
