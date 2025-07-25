import axios from "axios";
import CryptoJS from "crypto-js";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY, API_URL } from "../../shared/constants";
import type { AlertState } from "../../shared/interfaces";
import { ThemeContext } from "../../ThemeContext";
import Alert from "../Alert/Alert";
import Loader from "../Loader/Loader"; // Import the Loader component
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
  username?: string | null;
  onAvatarChange?: (avatarIndex: number) => void; // Add callback prop
  onUsernameChange?: (newUsername: string) => void; // <-- Add username change callback
}

const Navbar = ({
  avatar,
  userId,
  username,
  onAvatarChange,
  onUsernameChange,
}: NavbarProps) => {
  //region state
  const { theme, setTheme } = useContext(ThemeContext);
  const [swipe, setSwipe] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number>(avatar || 0);
  const [previousAvatar, setPreviousAvatar] = useState<number>(avatar || 0);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState<
    string | null | undefined
  >(username);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  //endregion

  //region effects
  useEffect(() => {
    setCurrentUsername(username);
  }, [username]);

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

  useEffect(() => {
    if (typeof avatar === "number") {
      setSelectedAvatar(avatar);
    }
  }, [avatar]);

  useEffect(() => {
    if (showSettings) {
      setIsEditingUsername(false);
      setEditedUsername(currentUsername ?? "");
    }
  }, [showSettings, currentUsername]);
  //endregion

  //region handlers
  const navigate = useNavigate();

  const showAlert = (
    message: string,
    type: "success" | "error" | "warning",
    subMessage?: string
  ) => {
    setAlert({ show: true, message, type, subMessage });
  };

  const hideAlert = () => {
    setAlert({ show: false, message: "", type: "success" });
  };

  const handleThemeToggle = () => {
    setSwipe(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 300);
    setTimeout(() => setSwipe(false), 600);
  };

  const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/sign", { replace: true });
  };

  const handleAvatarSelect = (avatarIndex: number) => {
    setSelectedAvatar(avatarIndex);
    if (onAvatarChange) {
      onAvatarChange(avatarIndex);
    }
    sessionStorage.setItem("selectedAvatar", avatarIndex.toString());
  };

  const handleChangeAvatar = async (avatar: number) => {
    if (avatar === selectedAvatar) return;
    const payload = { userId, avatar };
    await axios
      .put(`${API_URL}/api/users/avatar`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        console.log("Avatar updated successfully:", response.data);
        showAlert("Avatar successfully updated", "success");
      })
      .catch((error) => {
        console.error("Error updating avatar:", error);
        showAlert("Error updating avatar", "error");
        setSelectedAvatar(avatar);
      });
  };

  const handleSaveUsername = async () => {
    setDeleteLoading(true);
    await axios
      .put(
        `${API_URL}/api/username`,
        { userId, username: editedUsername },
        { headers: { "x-api-key": API_KEY } }
      )
      .then((response) => {
        setDeleteLoading(false);
        console.log(response);
        setCurrentUsername(editedUsername);
        showAlert("Username successfully updated", "success");
        setIsEditingUsername(false);
        if (typeof onUsernameChange === "function") {
          onUsernameChange(editedUsername);
        }
      })
      .catch((error) => {
        setDeleteLoading(false);
        showAlert("Error updating username", "error");
        console.error(error);
      });
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      showAlert("Please fill all fields", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showAlert("New passwords do not match", "error");
      return;
    }
    const encryptOldPassword = encryptData(oldPassword);
    const encryptNewPassword = encryptData(newPassword);
    await axios
      .put(
        `${API_URL}/api/users/userpassword`,
        {
          userId,
          oldPassword: encryptOldPassword,
          newPassword: encryptNewPassword,
        },
        { headers: { "x-api-key": API_KEY } }
      )
      .then(() => {
        showAlert("Password updated successfully", "success");
        resetPasswordFields();
      })
      .catch((error) => {
        const errorMsg =
          error?.response?.data?.error || "Error updating password";
        showAlert(errorMsg, "error");
      });
  };

  const resetPasswordFields = () => {
    setIsChangingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    await axios
      .delete(`${API_URL}/api/users`, {
        data: { userId },
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setDeleteLoading(false);
        console.log(response);
      })
      .catch((error) => {
        setDeleteLoading(false);
        console.error("Error updating avatar:", error);
        showAlert("Error updating avatar", "error");
      });
    navigate(-1);
  };
  //endregion

  //region derived
  const avatarSrc =
    typeof selectedAvatar === "number" &&
    selectedAvatar >= 0 &&
    selectedAvatar < avatarItems.length
      ? avatarItems[selectedAvatar]
      : avatarItems[0];
  //endregion

  //region refs
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  //endregion

  //region effects (dropdown close on outside click or escape)
  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showMenu]);
  //endregion

  //region UI
  return (
    <>
      <div className={`loader-fade-wrapper${deleteLoading ? " show" : ""}`}>
        <Loader />
      </div>
      {alert.show && (
        <Alert
          message={alert.message}
          subMessage={alert.subMessage}
          type={alert.type}
          timeout={5000}
          onClose={hideAlert}
        />
      )}
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
              <div className="navbar-avatar-menu" ref={avatarMenuRef}>
                <button
                  className="navbar-avatar-btn"
                  aria-label="User menu"
                  title="User menu"
                  type="button"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <img src={avatarSrc} alt="User avatar" />
                </button>
                {showMenu && (
                  <div className="navbar-avatar-dropdown">
                    <button
                      className="navbar-avatar-item"
                      onClick={() => {
                        setPreviousAvatar(selectedAvatar);
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
                    <button
                      className="navbar-avatar-item"
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
          {showChangeAvatar && (
            <Modal
              open={showChangeAvatar}
              onClose={() => {
                setSelectedAvatar(previousAvatar);
                setShowChangeAvatar(false);
              }}
            >
              <div className="avatar-selection">
                <h2>Choose Your Avatar</h2>
                <p className="avatar-selection-desc">
                  Select an avatar that represents you
                </p>
                <div className="avatar-grid">
                  {avatarItems.map((avatarSrc, index) => (
                    <button
                      key={avatarSrc}
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
                <div className="edit-buttons-avatar">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedAvatar(previousAvatar);
                      setShowChangeAvatar(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary "
                    onClick={() => {
                      handleChangeAvatar(selectedAvatar);
                      setShowChangeAvatar(false);
                    }}
                  >
                    Update
                  </button>
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
                  <span className="settings-label">Username</span>
                  <div className="settings-value settings-username-row">
                    {isEditingUsername ? (
                      <form
                        className="settings-password-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveUsername();
                        }}
                      >
                        <input
                          className="settings-username-input"
                          value={editedUsername}
                          onChange={(e) => setEditedUsername(e.target.value)}
                        />
                        <div className="edit-buttons">
                          <button
                            className="btn btn-primary btn-xs"
                            type="submit"
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-light btn-xs"
                            type="button"
                            onClick={() => {
                              setIsEditingUsername(false);
                              setEditedUsername(currentUsername ?? "");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
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
                  <span className="settings-label">Email</span>
                  <div className="settings-value">qwe@email.com</div>
                </div>
                <div className="settings-field">
                  <span className="settings-label">Password</span>
                  <div className="settings-value settings-password-row">
                    {isChangingPassword ? (
                      <form
                        className="settings-password-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdatePassword();
                        }}
                      >
                        <input
                          className="settings-password-input"
                          type="password"
                          placeholder="Old password"
                          value={oldPassword}
                          required
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                          className="settings-password-input"
                          type="password"
                          placeholder="New password"
                          value={newPassword}
                          required
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                          className="settings-password-input"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmNewPassword}
                          required
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                        <div className="edit-buttons">
                          <button
                            className="btn btn-primary btn-xs"
                            type="submit"
                          >
                            Update Password
                          </button>
                          <button
                            className="btn btn-light btn-xs"
                            type="button"
                            onClick={() => {
                              resetPasswordFields();
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <span className="settings-password">********</span>
                        <button
                          className="btn btn-light btn-xs"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          Change Password
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "1.5rem" }}
                  onClick={() => setShowSettings(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
              </div>
            </Modal>
          )}
          {showDeleteConfirm && (
            <Modal
              open={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
            >
              <div className="delete-modal-content">
                <h3 className="delete-modal-title">
                  Are you sure you want to delete the account?
                </h3>
                <p className="delete-modal-warning">This cannot be undone.</p>
                <div className="delete-modal-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser()}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-light"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </nav>
    </>
  );
  //endregion
};

export default Navbar;
