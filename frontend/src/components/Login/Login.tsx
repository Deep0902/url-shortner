import { useState } from "react";
import Particles from "../../Reactbits/Particles";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import Loader from "../Loader/Loader";
import Alert from "../Alert/Alert";
import "./Login.css";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";

function Login() {
  //region State
  const [currentState, setCurrentState] = useState<"first" | "second">("first");
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    subMessage: ""
  });
  //endregion

  //region Handlers
  const handleButtonClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentState === "second") {
        setCurrentState("first");
      } else {
        setCurrentState("second");
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    }, 400);
  };
  //endregion

  //region UI
  return (
    <div className="signin-container">
      <Navbar />
      {/* Loader and Alert UI moved here */}
      <div className={`loader-fade-wrapper${loading ? " show" : ""}`}>
        <Loader />
      </div>
      {alert.show && (
        <Alert
          message={alert.message}
          subMessage={alert.subMessage}
          type={alert.type}
          timeout={5000}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}
      <section>
        <div className="animated-layout">
          {/* Left Component */}
          <div
            className={`left-component ${
              currentState === "first" ? "visible" : "hidden"
            }`}
          >
            <div className="component-content">
              <Signin
                loading={loading}
                setLoading={setLoading}
                alert={alert}
                setAlert={setAlert}
              />
            </div>
          </div>

          {/* Center Rectangle */}
          <div
            className={`center-rectangle ${
              currentState === "first" ? "right-position" : "left-position"
            }`}
          >
            <div
              className={`rectangle-content ${
                isTransitioning ? "text-hidden" : "text-visible"
              }`}
            >
              {currentState === "first" && <h3>Welcome Back!</h3>}
              {currentState === "second" && <h3>You're one step away!</h3>}

              {currentState === "first" && <p>We're glad to see you again!</p>}
              {currentState === "second" && <p>Just a bit more</p>}
              <br />
              <button className="btn-secondary" onClick={handleButtonClick}>
                {currentState === "first"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </button>
            </div>
          </div>

          {/* Right Component */}
          <div
            className={`right-component ${
              currentState === "second" ? "visible" : "hidden"
            }`}
          >
            <div className="component-content">
              <Signup />
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
