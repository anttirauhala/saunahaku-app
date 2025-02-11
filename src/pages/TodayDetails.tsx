import { useParams } from "react-router-dom";
import { ISauna } from "../models/SaunaInterfaces";
import { useEffect, useState } from "react";
import "./SaunaDetails.css";
import {
  convertPriceType,
  formatPrice,
  formatTime,
  getCurrentWeekday,
} from "../common/Utils";

const TodayDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
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

  const todayOpeningHour = sauna.openingHours.find(
    (oh) => oh.weekday === currentWeekday
  );

  return (
    <div className="details-page">
      <h2>{sauna.name} - tänään</h2>
      <img src="/sauna_penguin.png" alt="Sauna Penguin" className="top-image" />

      {todayOpeningHour ? (
        <>
          <h3>Aukioloajat</h3>
          <p>
            {formatTime(todayOpeningHour.openingTime) ?? "?"} - {formatTime(todayOpeningHour.closingTime) ?? "?"}
          </p>
          <h3>Hinnat</h3>
          {todayOpeningHour.prices.map((price, index) => (
            <div key={index} className="price-data">
              {convertPriceType(price.priceType)}: {formatPrice(price.price)} EUR
            </div>
          ))}
        </>
      ) : (
        <p>Ei aukioloaikoja tälle päivälle.</p>
      )}

      <div className="back-container">
        <a href={`/sauna/${id}`} className="back-link">
          <img src="/back.png" alt="Back arrow" className="back-arrow" />
        </a>
      </div>
    </div>
  );
};

export default TodayDetails;
