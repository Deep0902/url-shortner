import axios from "axios";
import CryptoJS from "crypto-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY, API_URL } from "../../../shared/constants";
import "./Signin.css";

// Add your secret key here (should be the same in backend)
const SECRET_KEY = API_KEY; // Use API_KEY from constants.ts

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

function Signin({ setLoading, setAlert }: Readonly<SigninProps>) {
  //region State
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  //endregion

  //region Encryption Helper
  const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Sign in submitted with credentials:", credentials);

    // Encrypt the password before sending
    const encryptedPassword = encryptData(credentials.password);

    const payload = {
      email: credentials.email,
      password: encryptedPassword, // Send encrypted password
    };

    axios
      .post(`${API_URL}/api/login`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setLoading(false);
        if (response.data && response.data.message === "Login successful") {
          showAlert("Success!", "success", "Login successful!");
          navigate("/url-user");
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
        } else if (error.response && error.response.status === 404) {
          showAlert("Error", "error", "User not found");
        } else {
          showAlert("Error", "error", error.resp);
        }
        console.error("Error logging in:", error);
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
      <span className="label">Sign In</span>
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
