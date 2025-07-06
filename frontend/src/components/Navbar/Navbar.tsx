import { useContext, useState } from "react";
import { ThemeContext } from "../../ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [swipe, setSwipe] = useState(false);

  const handleThemeToggle = () => {
    setSwipe(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 300);
    setTimeout(() => setSwipe(false), 600);
  };

  return (
    <nav className="navbar">
      {swipe && <div className="theme-swipe" />}
      <div className="navbar-content">
        <button
          className="navbar-logo"
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.pathname = "/")}
        >
          <img src="/url-short.svg" alt="ChopURL logo" />
          <span className="navbar-logo-text">ChopURL</span>
        </button>
        <div className="navbar-links">
          <button
            className="navbar-theme-toggle"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
            title="Toggle theme"
            type="button"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
