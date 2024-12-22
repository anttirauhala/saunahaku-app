import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SaunaDetails from "./pages/SaunaDetails";
import FrontPage from "./pages/FrontPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/sauna/:id" element={<SaunaDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
