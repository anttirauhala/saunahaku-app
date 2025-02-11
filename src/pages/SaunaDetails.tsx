import { useParams, useNavigate } from "react-router-dom";
import { ISauna } from "../models/SaunaInterfaces";
import { useEffect, useState } from "react";
import "./SaunaDetails.css";
import {
  convertPriceType,
  convertWeekday,
  formatPrice,
  formatTime,
  getCurrentWeekday,
} from "../common/Utils";

const SaunaDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sauna, setSauna] = useState<ISauna | null>(null);
  const currentWeekday = getCurrentWeekday();
  const srv = import.meta.env.VITE_BACKEND_HOST;
  const port = import.meta.env.VITE_BACKEND_PORT;
  const apiPath = import.meta.env.VITE_API_PATH;

  useEffect(() => {
    fetch(`${srv}${port ? ":" + port : ""}${apiPath ? apiPath + "/list" : ""}`)
      .then((response) => response.json())
      .then((data: ISauna[]) => data.find((sauna) => sauna.id === id))
      .then((data) => setSauna(data!))
      .catch((error) => console.error("Error fetching data:", error));
  }, [srv, id, apiPath, port]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!sauna) {
    return <div>Loading...</div>;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="details-page">
      <div className="back-container">
        <button onClick={handleBackClick} className="back-link">
          <img src="/back.png" alt="Back arrow" className="back-arrow" />
        </button>
      </div>
      <h2>{sauna.name}</h2>
      <img src="/sauna_penguin.png" alt="Sauna Penguin" className="top-image" />

      <h3>Yhteystiedot</h3>
      <p>
        {sauna.streetAddress}
        <br></br>
        {sauna.postalCode}
        <br></br>
        {sauna.city}
      </p>
      <p className="sauna-info">
        {sauna.phone ? sauna.phone : null}
        {sauna.phone ? <br></br> : null}
        <a href={sauna.webPage} target="_blank" className="web-link">
          {sauna.webPage}
        </a>
      </p>
      {sauna.info?.length > 0 ? <h3>Info</h3> : null}
      {sauna.info?.length > 0 ? (
        <p className="info-text">{sauna.info}</p>
      ) : null}

      <h3>Palvelut</h3>
      <p className="sauna-info">
        Kioski: {sauna.kiosk ? "Kyllä" : "Ei"}
        <br></br>
        Ravintola: {sauna.restaurant ? "Kyllä" : "Ei"}
      </p>

      <h3>Aukiolo ja hinnat</h3>

      {sauna.openingHours.map((oh, index) => (
        <p key={index}>
          <div
            className={oh.weekday === currentWeekday ? "current-day clickable" : ""}
            // if current day and has valid opening times, allow click to view today's details
            onClick={() => {
              if (oh.weekday === currentWeekday && oh.openingTime && oh.closingTime) {
                navigate(`/sauna/${id}/today`);
              }
            }}
          >
            <div key={index}>
              <b>
                {convertWeekday(oh.weekday)}
                <br />
                {formatTime(oh.openingTime) ?? "?"} - {formatTime(oh.closingTime) ?? "?"}
              </b>
            </div>
            <br></br>
            <div>
              {oh.prices &&
                oh.prices.map((price, index) => (
                  <div key={index} className="price-data">
                    {convertPriceType(price.priceType)}: {formatPrice(price.price)} EUR
                  </div>
                ))}
            </div>
          </div>
        </p>
      ))}
      <div className="back-container">
        <button onClick={handleBackClick} className="back-link">
          <img src="/back.png" alt="Back arrow" className="back-arrow" />
        </button>
      </div>
    </div>
  );
};

export default SaunaDetails;
