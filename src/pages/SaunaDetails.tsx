import { useParams } from "react-router-dom";
import { ISauna } from "../models/SaunaInterfaces";
import { useEffect, useState } from "react";
import "./SaunaDetails.css";
import { convertPriceType, convertWeekday, formatTime, getCurrentWeekday } from "../common/Utils";

const SaunaDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [sauna, setSauna] = useState<ISauna | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/sauna/${id}`)
      .then((response) => response.json())
      .then((data) => setSauna(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!sauna) {
    return <div>Loading...</div>;
  }

  const currentWeekday = getCurrentWeekday();

  return (
    <div className="details-page">
      <h1>{sauna.name}</h1>
      <img src="/sauna_penguin.png" alt="Sauna Penguin" className="top-image" />

      <h3>Osoite</h3>
      <p>
        {sauna.streetAddress}
        <br></br>
        {sauna.postalCode}
        <br></br>
        {sauna.city}
      </p>
      <h3>Aukiolo ja hinnat</h3>

      {sauna.openingHours.map((oh, index) => (
        <p>
         <div className={oh.weekday === currentWeekday ? "current-day" : ""}>
          <div
            key={index}
          >
            <b>
              {convertWeekday(oh.weekday)}
              <br />
              {formatTime(oh.openingTime) ?? "?"} -{" "}
              {formatTime(oh.closingTime) ?? "?"}
            </b>
          </div>
          <div>
            {oh.prices &&
              oh.prices.map((price, index) => (
                <div key={index}>
                  {convertPriceType(price.priceType)}: {price.price} eur
                </div>
              ))}
          </div>
          </div>

        </p>
      ))}
    </div>
  );
};

export default SaunaDetails;
