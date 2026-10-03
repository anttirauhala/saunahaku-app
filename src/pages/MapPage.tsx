import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ISauna } from "../models/SaunaInterfaces";
import { getBackendUrl, isSaunaOpenNow } from "../common/Utils";
import ViewToggle from "../components/ViewToggle";
import "./MapPage.css";

const MapPage = (): JSX.Element => {
  const [saunas, setSaunas] = useState<ISauna[]>([]);
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    fetch(getBackendUrl())
      .then((response) => response.json())
      .then((data: ISauna[]) => setSaunas(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [23.76, 61.5],
      zoom: 9,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = saunas
      .filter((sauna) => sauna.latitude != null && sauna.longitude != null)
      .map((sauna) => {
        const element = document.createElement("button");
        element.type = "button";
        element.title = sauna.name;
        element.className = isSaunaOpenNow(sauna)
          ? "sauna-marker open"
          : "sauna-marker closed";
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          navigate(`/sauna/${sauna.id}`);
        });

        return new maplibregl.Marker({ element })
          .setLngLat([sauna.longitude!, sauna.latitude!])
          .addTo(map);
      });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [saunas, navigate]);

  return (
    <div className="map-page">
      <h1 className="map-title">Saunahaku</h1>
      <ViewToggle active="map" />
      <div className="map-legend">
        <span className="legend-item">
          <span className="legend-dot open" /> Auki
        </span>
        <span className="legend-item">
          <span className="legend-dot closed" /> Kiinni
        </span>
      </div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapPage;