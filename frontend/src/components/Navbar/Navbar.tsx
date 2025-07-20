import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../ThemeContext";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const avatarItems = [
  "/avatars/avatar-male-1.svg",
  "/avatars/avatar-male-2.svg",
  "/avatars/avatar-male-3.svg",
  "/avatars/avatar-girl-1.svg",
  "/avatars/avatar-girl-2.svg",
  "/avatars/avatar-girl-3.svg",
];

interface NavbarProps {
  avatar?: number | null;
}

const Navbar = ({ avatar }: NavbarProps) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [swipe, setSwipe] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const handleThemeToggle = () => {
    setSwipe(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 300);
    setTimeout(() => setSwipe(false), 600);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    // Redirect to login and replace history
    navigate("/sign", { replace: true });
  };
  useEffect(() => {
    const root = document.body;
    if (theme === "light") {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
    } else {
      root.classList.remove("light-theme");
      root.classList.add("dark-theme");
    }
  }, [theme]);

  const avatarSrc =
    typeof avatar === "number" && avatar >= 0 && avatar < avatarItems.length
      ? avatarItems[avatar]
      : null;

  return (
    <nav className="navbar">
      {swipe && <div className="theme-swipe" />}
      <div className="navbar-content">
        <button
          className="navbar-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
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
          {avatarSrc && (
            <div
              className="navbar-avatar-menu"
              style={{ position: "relative", display: "inline-block" }}
            >
              <button
                className="navbar-avatar-btn"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: "50%",
                }}
                aria-label="User menu"
                title="User menu"
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <img
                  src={avatarSrc}
                  alt="User avatar"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                  }}
                />
              </button>
              {showMenu && (
                <div
                  className="navbar-avatar-dropdown"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    minWidth: "120px",
                    zIndex: 5,
                  }}
                >
                  <button
                    className="navbar-avatar-item"
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    Settings
                  </button>
                  <button
                    className="navbar-avatar-item"
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
