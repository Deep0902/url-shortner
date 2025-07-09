import { useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import "./Login.css";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";

function Login() {
  const [currentState, setCurrentState] = useState<"first" | "second">("first");
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
    <>
      <div className="signin-container">
        <Navbar />
        <section>
          <div className="animated-layout">
            {/* Left Component */}
            <div
              className={`left-component ${
                currentState === "first" ? "visible" : "hidden"
              }`}
            >
              <div className="component-content">
                <Signin />
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

                {currentState === "first" && (
                  <p>We're glad to see you again!</p>
                )}
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
      </div>
    </>
  );
}

export default Login;
