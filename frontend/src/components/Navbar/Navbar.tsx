import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY, API_URL } from "../../shared/constants";
import { ThemeContext } from "../../ThemeContext";
import Modal from "../Modal/Modal";
import "./Navbar.css";

const SECRET_KEY = API_KEY; // Use API_KEY from constants.ts
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
  userId?: string | null;
  onAvatarChange?: (avatarIndex: number) => void; // Add callback prop
}

const Navbar = ({ avatar, userId, onAvatarChange }: NavbarProps) => {
  //region State
  const { theme, setTheme } = useContext(ThemeContext);
  const [swipe, setSwipe] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number>(avatar || 0);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  //endregion

  //region handlers
  const handleThemeToggle = () => {
    setSwipe(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 300);
    setTimeout(() => setSwipe(false), 600);
  };

  const navigate = useNavigate();

  const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  };

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

  const handleChangeAvatar = async (avatar: number) => {
    if (avatar === selectedAvatar) {
      return;
    }
    const payload = {
      userId: userId,
      avatar: avatar,
    };
    await axios
      .put(`${API_URL}/api/users/avatar`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        console.log("Avatar updated successfully:", response.data);
        // Optionally, you can update the avatar in sessionStorage
      })
      .catch((error) => {
        console.error("Error updating avatar:", error);
        setSelectedAvatar(avatar);
      });
  };

  const handleSaveUsername = async () => {
    await axios
      .put(
        `${API_URL}/api/username`,
        { userId, username: editedUsername },
        {
          headers: { "x-api-key": API_KEY },
        }
      )
      .then(() => {
        setCurrentUsername(editedUsername);
        setIsEditingUsername(false);
      })
      .catch(() => {
        // Optionally show error
      });
  };
  //endregion

  //region effects
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

  // When opening settings modal, reset edit state
  useEffect(() => {
    if (showSettings) {
      setIsEditingUsername(false);
      setEditedUsername(currentUsername);
    }
  }, [showSettings, currentUsername]);
  //endregion

  //region derived
  const avatarSrc =
    typeof selectedAvatar === "number" &&
    selectedAvatar >= 0 &&
    selectedAvatar < avatarItems.length
      ? avatarItems[selectedAvatar]
      : avatarItems[0]; // Default to first avatar if none selected
  //endregion

  //region UI
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
          {avatar && avatarSrc && (
            <div className="navbar-avatar-menu">
              <button
                className="navbar-avatar-btn"
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
                <div className="navbar-avatar-dropdown">
                  <button
                    className="navbar-avatar-item"
                    onClick={() => {
                      setShowChangeAvatar(true);
                      setShowMenu(false);
                    }}
                  >
                    Change Avatar
                  </button>
                  <button
                    className="navbar-avatar-item"
                    onClick={() => {
                      setShowSettings(true);
                      setShowMenu(false);
                    }}
                  >
                    Settings
                  </button>
                  <button className="navbar-avatar-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="modal">
        {showChangeAvatar && (
          <Modal
            open={showChangeAvatar}
            onClose={() => {
              handleChangeAvatar(selectedAvatar);
              setShowChangeAvatar(false);
            }}
          >
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
                    className={`avatar-option${
                      selectedAvatar === index ? " selected" : ""
                    }`}
                    onClick={() => handleAvatarSelect(index)}
                  >
                    <img
                      src={avatarSrc}
                      alt={`Avatar ${index + 1}`}
                      className="avatar-img"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        )}
        {showSettings && (
          <Modal
            open={showSettings}
            onClose={() => {
              setShowSettings(false);
            }}
          >
            <div className="settings-modal-content">
              <h2 className="settings-title">Account Settings</h2>
              <div className="settings-field">
                <label className="settings-label">Username</label>
                <div className="settings-value settings-username-row">
                  {isEditingUsername ? (
                    <>
                      <input
                        className="settings-username-input"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                      />
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={handleSaveUsername}
                        style={{ marginLeft: 8 }}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-light btn-xs"
                        onClick={() => {
                          setIsEditingUsername(false);
                          setEditedUsername(currentUsername);
                        }}
                        style={{ marginLeft: 4 }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{currentUsername}</span>
                      <button
                        className="btn btn-light btn-xs"
                        style={{ marginLeft: 8 }}
                        onClick={() => setIsEditingUsername(true)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="settings-field">
                <label className="settings-label">Email</label>
                <div className="settings-value">qwe@email.com</div>
              </div>
              <div className="settings-field">
                <label className="settings-label">Password</label>
                <div className="settings-value settings-password">********</div>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: "1.5rem" }}
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </div>
    </nav>
  );
  //endregion
};

export default Navbar;
