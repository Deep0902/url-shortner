import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../ThemeContext";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Avatar, Menu, Portal } from "@chakra-ui/react";

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
            <Menu.Root positioning={{ placement: "bottom-end" }}>
              <Menu.Trigger rounded="full" focusRing="outside">
                <Avatar.Root size="sm">
                  <Avatar.Fallback name="User" />
                  <Avatar.Image src={avatarSrc} />
                </Avatar.Root>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="account">Account</Menu.Item>
                    <Menu.Item value="settings">Settings</Menu.Item>
                    <Menu.Item
                      value="logout"
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
