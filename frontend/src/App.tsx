import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import UrlShortner from "./components/UrlShortner/UrlShortner";
import Lenis from "lenis";

function App() {
 useEffect(() => {
  const lenis = new Lenis();
  function raf(time: any) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}, []);

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
