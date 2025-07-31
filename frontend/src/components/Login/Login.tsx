import { useEffect, useState } from "react";
import Particles from "../../Reactbits/Particles";
import Alert from "../Alert/Alert";
import Footer from "../Footer/Footer";
import Loader from "../Loader/Loader";
import Navbar from "../Navbar/Navbar";
import "./Login.css";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";
import axios from "axios";
import { API_URL, API_KEY } from "../../shared/constants";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
const SECRET_KEY = API_KEY; // Use API_KEY from constants.ts

function Login() {
  //region State
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "warning";
    subMessage?: string;
  }>({
    show: false,
    message: "",
    type: "success",
    subMessage: "",
  });
    const navigate = useNavigate();
  //endregion

  //region Handlers
  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };
  useEffect(() => {
    if (!isSignUp) {
      const stored = sessionStorage.getItem("userCredentials");
      if (stored) {
        setLoading(true)
        const creds = JSON.parse(stored) as { email: string; password: string };
        // Decrypt the password before using
        let decryptedPassword = "";
        try {
          const bytes = CryptoJS.AES.decrypt(creds.password, SECRET_KEY);
          decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        } catch {
          decryptedPassword = "";
        }
        if (creds.email && decryptedPassword) {
          const payload = {
            email: creds.email,
            password: creds.password, // Send encrypted password
          };
          axios
            .post(`${API_URL}/api/login`, payload, {
              headers: { "x-api-key": API_KEY },
            })
            .then((response) => {
              setLoading(false);
              if (response.data && response.data.message === "Login successful") {
                navigate("/url-user", {
                  state: { loginResponse: response.data },
                });
              }
            })
            .catch(() => {
              setLoading(false);
              // Do nothing, let user proceed with login
            });
        }
      }
    }
  }, [isSignUp]);
  //endregion

  //region UI
  return (
    <div className="signin-container">
      <Navbar />

      {/* Loader and Alert UI */}
      <div className={`loader-fade-wrapper${loading ? " show" : ""}`}>
        <Loader />
      </div>
      {alert.show && (
        <Alert
          message={alert.message}
          subMessage={alert.subMessage}
          type={alert.type}
          timeout={5000}
          onClose={() =>
            setAlert({
              show: false,
              message: "",
              type: "success",
              subMessage: "",
            })
          }
        />
      )}

      <section>
        <div className="animated-layout">
          {/* Toggle Switch */}
          <div className="toggle-container">
            {/* Labels */}
            <div className="toggle-labels">
              <span
                className={!isSignUp ? "active" : "inactive"}
                onClick={() => setIsSignUp(false)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsSignUp(false)
                }
              >
                Sign In
              </span>
              <span
                className={isSignUp ? "active" : "inactive"}
                onClick={() => setIsSignUp(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setIsSignUp(true)
                }
              >
                Sign Up
              </span>
            </div>

            {/* Toggle Switch */}
            <div
              className="toggle-switch"
              onClick={handleToggle}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleToggle()
              }
            >
              <div className={`toggle-circle ${isSignUp ? "moved" : ""}`}>
                <div className={`toggle-arrow ${isSignUp ? "rotated" : ""}`}>
                  <svg viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1L11 6L6 11M11 6H1"
                      stroke="#374151"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Flip Container */}
          <div className={`flip-container ${isSignUp ? "flipped" : ""}`}>
            {/* Sign In Form (Front) */}
            <div className="form-side front">
              <div className="component-content">
                <Signin
                  loading={loading}
                  setLoading={setLoading}
                  alert={alert}
                  setAlert={setAlert}
                  onMobileSignup={() => setIsSignUp(true)}
                />
              </div>
            </div>

            {/* Sign Up Form (Back) */}
            <div className="form-side back">
              <div className="component-content">
                <Signup
                  loading={loading}
                  setLoading={setLoading}
                  alert={alert}
                  setAlert={setAlert}
                  onMobileSignIn={() => setIsSignUp(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <div className="particles-bg">
        <Particles />
      </div>
    </div>
  );
  //endregion
}

export default Login;
