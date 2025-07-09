import Lenis from "lenis";
import { useEffect, useMemo, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import UrlShortner from "./components/UrlShortner/UrlShortner";
import { ThemeContext, type ThemeType } from "./ThemeContext";
import SignIn from "./components/SignIn/SignIn";

function App() {
  // Detect system theme on first load
  const getSystemTheme = () => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }
    return "dark";
  };

  const [theme, setTheme] = useState<ThemeType>(() => getSystemTheme());

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  // Optionally, listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "light" : "dark");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const themeContextValue = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Router>
        <Routes>
          <Route path="/url" element={<UrlShortner />} />
          <Route path="/" index element={<LandingPage />} />
          <Route path="/sign" element={<SignIn />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
