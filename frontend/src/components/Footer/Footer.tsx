import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import "./Footer.css";

//region State
const Footer = () => {
  const { theme } = useContext(ThemeContext);
//endregion

//region UI
  return (
    <footer className={` footer${theme === "light" ? " footer-light" : ""}`}>
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/url-short.svg" alt="ChopURL logo" />
          <span className="footer-logo-text">ChopURL</span>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/Deep0902"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            View my work
          </a>
          <span className="footer-divider">•</span>
          <a href="mailto:deeptank09@gmail.com" className="footer-link">
            Reach out
          </a>
          <span className="footer-divider">•</span>
          <a href="/" className="footer-link">
            Back to Home
          </a>
        </div>
        <p className="footer-text">Made with ❤️ for better link sharing</p>
      </div>
    </footer>
  );
//endregion
};

export default Footer;
