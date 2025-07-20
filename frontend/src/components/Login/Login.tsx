import { useState } from "react";
import Particles from "../../Reactbits/Particles";
import Alert from "../Alert/Alert";
import Footer from "../Footer/Footer";
import Loader from "../Loader/Loader";
import Navbar from "../Navbar/Navbar";
import "./Login.css";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";

function Login() {
  //region State
  const [isSignUp, setIsSignUp] = useState(false);
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
  //endregion

  //region Handlers
  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };
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
              <span className={!isSignUp ? "active" : "inactive"}>Sign In</span>
              <span className={isSignUp ? "active" : "inactive"}>Sign Up</span>
            </div>

            {/* Toggle Switch */}
            <div className="toggle-switch" onClick={handleToggle}>
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
