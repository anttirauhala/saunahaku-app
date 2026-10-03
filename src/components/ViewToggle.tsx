import { useNavigate } from "react-router-dom";
import "./ViewToggle.css";

interface ViewToggleProps {
  active: "list" | "map";
}

const ViewToggle = ({ active }: ViewToggleProps): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="view-toggle" role="group" aria-label="Näkymän valinta">
      <button
        type="button"
        className={`view-toggle-button${active === "list" ? " active" : ""}`}
        onClick={() => navigate("/")}
      >
        LISTA
      </button>
      <button
        type="button"
        className={`view-toggle-button${active === "map" ? " active" : ""}`}
        onClick={() => navigate("/kartta")}
      >
        KARTTA
      </button>
    </div>
  );
};

export default ViewToggle;