import axios from "axios";
import { useState } from "react";
import Alert from "../../Alert/Alert";
import Loader from "../../Loader/Loader";
import "./Signin.css";
interface AlertState {
  show: boolean;
  message: string;
  subMessage?: string;
  type: "success" | "error" | "warning";
}
function Signin() {
  const API_KEY = import.meta.env.VITE_API_SECRET_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
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
  const hideAlert = () => {
    setAlert({
      show: false,
      message: "",
      type: "success",
    });
  };
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in submitted with credentials:", credentials);
    axios
      .post(`${API_URL}/api/login`, credentials, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setLoading(false);
        if (response.data.shortUrl) {
          showAlert("Success!", "success", `URL shortened successfully`);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 429) {
          showAlert(
            "Service Unavailable",
            "error",
            "Storage limit reached. Contact admin."
          );
        } else {
          showAlert(
            "Error",
            "error",
            "Failed to shorten URL. Please try again."
          );
          console.error("Error shortening URL:", error);
        }
      });
  };
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "qwe@email.com",
    password: "test",
  });
  const [showPassword, setShowPassword] = useState(true);
  const handlePasswordView = () => {
    setShowPassword(!showPassword);
  };
  const handleChangeSignIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
      <div className={`loader-fade-wrapper${loading ? " show" : ""}`}>
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
      <div className="credentialsCard">
        <label className="">Sign In</label>
        <span className=" subtext">
          Please login to continue to your account.
        </span>

        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              className=""
              type="email"
              placeholder="Email (tom@email.com)"
              name="user_email"
              onChange={handleChangeSignIn}
              value={credentials.email}
            />
          </div>
          <div className="inputBox">
            <input
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              name="user_pass"
              onChange={handleChangeSignIn}
              className=""
              placeholder="Password (tomiscool)"
            />
            <span className="toggle-button" onClick={handlePasswordView}>
              👁️
            </span>
          </div>
          <div className="checkboxInput">
            <input
              type="checkbox"
              id="customCheckbox"
              className="styled-checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="customCheckbox" className="">
              &nbsp;Keep Me Logged In
            </label>
          </div>
          <button className="btn" type="submit">
            Sign In
          </button>
        </form>

        <div className="or-section">
          <hr className="line" />
          <span className="or-text ">or</span>
          <hr className="line" />
        </div>
        <div className="bottomSection">
          <p className="underlineText ">Forgot Password</p>
        </div>
      </div>
    </>
  );
}

export default Signin;
