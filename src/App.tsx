import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SaunaDetails from "./pages/SaunaDetails";
import FrontPage from "./pages/FrontPage";
import TodayDetails from "./pages/TodayDetails";

// The map pulls in maplibre-gl (large), so load it only when needed.
const MapPage = lazy(() => import("./pages/MapPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/kartta" element={<MapPage />} />
          <Route path="/sauna/:id" element={<SaunaDetails />} />
          <Route path="/sauna/:id/today" element={<TodayDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
