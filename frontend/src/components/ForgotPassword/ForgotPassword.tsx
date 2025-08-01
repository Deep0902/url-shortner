import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "../../Reactbits/Particles";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import "./ForgotPassword.css";
import Loader from "../Loader/Loader";
import Alert from "../Alert/Alert";
import type { AlertState } from "../../shared/interfaces";
import { API_KEY, API_URL } from "../../shared/constants";
import axios from "axios";
import CryptoJS from "crypto-js";

const SECRET_KEY = API_KEY; // Use API_KEY from constants.ts

function ForgotPassword() {
  //region State
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const showAlert = (
    message: string,
    type: "success" | "error" | "warning",
    subMessage?: string
  ) => {
    setAlert({
      show: true,
      message,
      type,
      subMessage,
    });
  };
  //endregion

  //region Steps
  const steps = [
    { label: "Email", description: "Enter your email" },
    { label: "OTP", description: "Enter OTP" },
    { label: "Password", description: "Set new password" },
  ];
  //endregion

  //region Form
  // No form hook needed for simple HTML forms
  //endregion

  //region Handlers

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      showAlert("Invalid OTP", "error", "Please enter the correct OTP");
      return;
    }
    setStep(3);
  };

  const handleOtpChange = (value: string, index: number) => {
    const otpArray = otp.split("");
    while (otpArray.length < 6) {
      otpArray.push("");
    }
    otpArray[index] = value;
    setOtp(otpArray.join(""));

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !(e.currentTarget as HTMLInputElement).value &&
      index > 0
    ) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    setShowPassword(false);
    setLoading(true);
    e.preventDefault();
    const encrypted = encryptData(password);
    const payload = {
      email: email,
      encryptedPassword: encrypted,
    };
    console.log("Payload: ", payload);
    axios
      .post(`${API_URL}/api/forgot-password`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setLoading(false);
        if (response.status == 200 && response.data.message) {
          showAlert("Success", "success", "Password successfully updated!");
          navigate("/url-user", {
            state: { loginResponse: response.data },
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.status == 400) {
          showAlert("Error", "error", "Invalid password format");
        }
        showAlert("Error", "error", "Failed to update Password");
        console.error("Error shortening URL", error.data.message);
      });
  };

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log();

    setLoading(true);
    axios
      .post(
        `${API_URL}/api/forgot-email`,
        { email: email },
        { headers: { "x-api-key": API_KEY } }
      )
      .then((response) => {
        setLoading(false);
        if (response.status == 200 && response.data.message) {
          showAlert("OTP", "warning", "OTP is 123456");
          setStep(2);
        }
      })
      .catch((error) => {
        setLoading(false);
        showAlert("Error", "error", "Failed to fetch email");
        console.error("Error shortening URL:", error);
      });
  };

  const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  };

  const hideAlert = () => {
    setAlert({
      show: false,
      message: "",
      type: "success",
    });
  };
  //endregion

  //region UI
  return (
    <div className="forgot-content">
      {alert.show && (
        <Alert
          message={alert.message}
          subMessage={alert.subMessage}
          type={alert.type}
          timeout={5000}
          onClose={hideAlert}
        />
      )}
      <div className={`loader-fade-wrapper${loading ? " show" : ""}`}>
        <Loader />
      </div>
      <Navbar />
      <div className="forgot-password-content">
        <div className="steps-container">
          <br />
          <div className="steps-row">
            {steps.map((s, idx) => (
              <div key={s.label} className="step-item">
                <div
                  className={`step-circle${step === idx + 1 ? " active" : ""}`}
                >
                  {idx + 1}
                </div>
                <div
                  className={`step-label${step === idx + 1 ? " active" : ""}`}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="steps-progress-bar">
            <div
              className="steps-progress"
              style={{
                width: `${((step - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="credentialsCard">
          {step === 1 && (
            <form onSubmit={handleForgotEmail}>
              <span className="label">Forgot Password</span>
              <span className="subtext">
                Enter your email to receive an OTP.
              </span>
              <div className="inputBox">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=""
                  autoFocus
                />
              </div>

              <button className="btn" type="submit">
                Send OTP
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <span className="label">Enter OTP</span>
              <span className="subtext">Check your email for the OTP.</span>
              <div
                className="otp-container"
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  margin: "20px 0",
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    style={{
                      width: "40px",
                      height: "40px",
                      textAlign: "center",
                      fontSize: "18px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      outline: "none",
                    }}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <button className="btn" type="submit">
                Verify OTP
              </button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit}>
              <span className="label">Set New Password</span>
              <span className="subtext">Enter your new password.</span>
              <div className="inputBox">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className=""
                  placeholder="New Password"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  className="toggle-button"
                  onClick={handlePasswordView}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                  style={{
                    background: "none",
                    border: "none",
                    position: "absolute",
                    right: 5,
                    top: "56%",
                    transform: "translateY(-50%)",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  👁️
                </button>
              </div>
              <button className="btn" type="submit">
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
      <div className="particles-bg">
        <Particles />
      </div>
    </div>
  );
  //endregion
}

export default ForgotPassword;
