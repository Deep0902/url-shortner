import axios from "axios";
import { useState } from "react";
import "./Signin.css";

interface AlertState {
  show: boolean;
  message: string;
  subMessage?: string;
  type: "success" | "error" | "warning";
}

interface SigninProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  alert: AlertState;
  setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
}

function Signin({ loading, setLoading, alert, setAlert }: SigninProps) {
  //region State
  const API_KEY = import.meta.env.VITE_API_SECRET_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "qwe@email.com",
    password: "test",
  });
  const [showPassword, setShowPassword] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  //endregion

  //region Handlers
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Sign in submitted with credentials:", credentials);
    axios
      .post(`${API_URL}/api/login`, credentials, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setLoading(false);
        if (response.data && response.data.message === "Login successful") {
          showAlert("Success!", "success", "Login successful!");
        } else {
          showAlert(
            "Error",
            "error",
            response.data?.error || "Unknown error. Please try again."
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          showAlert(
            "Error",
            "error",
            "Incorrect Credentials. Please try again."
          );
        } else {
          showAlert("Error", "error", "Server error");
        }
        console.error("Error shortening URL:", error);
      });
  };

  const handlePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handleChangeSignIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  //endregion

  //region UI
  return (
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
            name="email"
            onChange={handleChangeSignIn}
            value={credentials.email}
          />
        </div>
        <div className="inputBox">
          <input
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            name="password"
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
  );
  //endregion
}

export default Signin;
