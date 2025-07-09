import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./SignIn.css";

function SignIn() {
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
                currentState === "first" ? "visible" : "visible"
              }`}
            >
              <div className="component-content">
                <h2>Sign In Component</h2>
                <p>
                  This is the left side component with some placeholder content.
                </p>
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
                currentState === "second" ? "visible" : "visible"
              }`}
            >
              <div className="component-content">
                <h2>Sign Up Component</h2>
                <p>
                  This is the right side component that appears after
                  transition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default SignIn;
