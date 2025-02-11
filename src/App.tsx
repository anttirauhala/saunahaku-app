import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SaunaDetails from "./pages/SaunaDetails";
import FrontPage from "./pages/FrontPage";
import TodayDetails from "./pages/TodayDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/sauna/:id" element={<SaunaDetails />} />
        <Route path="/sauna/:id/today" element={<TodayDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
