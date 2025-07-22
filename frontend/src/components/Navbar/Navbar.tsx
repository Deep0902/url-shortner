import { useContext, useEffect, useState } from "react";
import Modal from "../Modal/Modal";
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
  onAvatarChange?: (avatarIndex: number) => void; // Add callback prop
}

const Navbar = ({ avatar, onAvatarChange }: NavbarProps) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [swipe, setSwipe] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number>(avatar || 0);

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

  const handleAvatarSelect = (avatarIndex: number) => {
    setSelectedAvatar(avatarIndex);
    // Call the parent component's callback if provided
    if (onAvatarChange) {
      onAvatarChange(avatarIndex);
    }
    // You can also save to localStorage or sessionStorage here
    sessionStorage.setItem("selectedAvatar", avatarIndex.toString());
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

  // Update selectedAvatar when prop changes
  useEffect(() => {
    if (typeof avatar === "number") {
      setSelectedAvatar(avatar);
    }
  }, [avatar]);

  const avatarSrc =
    typeof selectedAvatar === "number" &&
    selectedAvatar >= 0 &&
    selectedAvatar < avatarItems.length
      ? avatarItems[selectedAvatar]
      : avatarItems[0]; // Default to first avatar if none selected

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
                    background: "var(--color-bg-main)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    minWidth: "120px",
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
                      color: "var(--color-text-main)",
                    }}
                    onClick={() => {
                      setShowModal(true);
                      setShowMenu(false);
                    }}
                  >
                    Change Avatar
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
                      color: "var(--color-text-main)",
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
                      color: "var(--color-text-main)",
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
      <div className="modal">
        {showModal && (
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <div className="avatar-selection">
              <h2>Choose Your Avatar</h2>
              <p
                style={{
                  marginBottom: "24px",
                  color: "var(--color-text-secondary)",
                }}
              >
                Select an avatar that represents you
              </p>
              <div className="avatar-grid">
                {avatarItems.map((avatarSrc, index) => (
                  <button
                    key={index}
                    className={`avatar-option ${
                      selectedAvatar === index ? "selected" : ""
                    }`}
                    onClick={() => handleAvatarSelect(index)}
                    style={{
                      background: "none",
                      border:
                        selectedAvatar === index
                          ? "3px solid var(--color-blue)"
                          : "2px solid var(--color-border)",
                      borderRadius: "50%",
                      padding: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      transform:
                        selectedAvatar === index ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <img
                      src={avatarSrc}
                      alt={`Avatar ${index + 1}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "block",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
