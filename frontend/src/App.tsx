import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import UrlShortner from "./components/UrlShortner/UrlShortner";
import LandingPage from "./components/LandingPage/LandingPage";

function App() {
 
  return (
    <>
      <Router>
        <Routes>
          <Route path="/url" element={<UrlShortner />} />
          <Route path="/" index element={<LandingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
