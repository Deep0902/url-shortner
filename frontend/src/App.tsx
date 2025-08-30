import Lenis from "lenis";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import LandingPage from "./components/LandingPage/LandingPage";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";
import Logout from "./components/Logout";
import UrlShortner from "./components/UrlShortner/UrlShortner";
import { ThemeContext, type ThemeType } from "./ThemeContext";
import { Analytics } from "@vercel/analytics/next";

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
  const UrlShortnerUser = lazy(
    () => import("./components/UrlShortnerUser/UrlShortnerUser")
  );

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

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "light" ? "#fff" : "#10131a" // match your CSS variables
      );
    }
  }, [theme]);

  const themeContextValue = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceworker.js", { scope: "/" })
        .catch(() => {});
      window.addEventListener("beforeinstallprompt", (event: any) => {
        event.preventDefault();
        const installDiv = document.getElementById("divInstallApp");
        if (installDiv) {
          installDiv.innerHTML =
            '<button id="installApp" class="btn btn-outline-secondary ms-1">Install App</button>';
          installDiv.onclick = () => {
            event.prompt();
            installDiv.innerHTML = "";
          };
        }
      });
    }
  }, []);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <ThemeContext.Provider value={themeContextValue}>
          <Router>
            <Routes>
              <Route path="/url" element={<UrlShortner />} />
              <Route path="/" index element={<LandingPage />} />
              <Route path="/sign" element={<Login />} />
              <Route path="/url-user" element={<UrlShortnerUser />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Router>
        </ThemeContext.Provider>
      </Suspense>
      <Analytics />
    </>
  );
}

export default App;
