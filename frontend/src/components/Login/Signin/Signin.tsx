import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
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
  onMobileSignup?: () => void;
}

function Signin({
  setLoading,
  setAlert,
  onMobileSignup,
}: Readonly<SigninProps>) {
  //region State
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(() => {
    const stored = sessionStorage.getItem("userCredentials");
    return stored ? JSON.parse(stored).rememberMe || false : false;
  });
  const navigate = useNavigate();
  //endregion

  //region Auto-login from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem("userCredentials");
    if (stored) {
      const creds = JSON.parse(stored) as {
        email: string;
        password: string;
        rememberMe?: boolean;
        autoLogin?: boolean;
      };

      let decryptedPassword = "";
      try {
        const bytes = CryptoJS.AES.decrypt(creds.password, SECRET_KEY);
        decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      } catch {
        decryptedPassword = "";
      }
      setCredentials({ email: creds.email, password: decryptedPassword });
      setIsChecked(creds.rememberMe || false);

      // Only auto-login if autoLogin flag is true and jwtToken exists
      if (creds.rememberMe && localStorage.getItem("jwtToken")) {
        setLoading(true);
        const payload = {
          email: creds.email,
          password: creds.password, // Use encrypted password
        };
        performLogin(payload, true);
      }
    }
    if (!localStorage.getItem("jwtToken")) {
      return;
    }
    if (stored) {
      const creds = JSON.parse(stored) as {
        email: string;
        password: string;
        rememberMe?: boolean;
        autoLogin?: boolean;
      };

      // Always fill the form fields
      let decryptedPassword = "";
      try {
        const bytes = CryptoJS.AES.decrypt(creds.password, SECRET_KEY);
        decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      } catch {
        decryptedPassword = "";
      }
      setCredentials({ email: creds.email, password: decryptedPassword });
      setIsChecked(creds.rememberMe || false);

      // Only auto-login if autoLogin flag is true
      if (creds.autoLogin) {
        setLoading(true);
        const payload = {
          email: creds.email,
          password: creds.password, // Use encrypted password
        };

        performLogin(payload, true);
      }
    }
  }, []);

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

  //region Login API Helper
  const performLogin = async (
    loginPayload: { email: string; password: string },
    isAutoLogin = false
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, loginPayload, {
        headers: { "x-api-key": API_KEY },
      });

      setLoading(false);
      if (response.data && response.data.message === "Login successful") {
        localStorage.setItem("jwtToken", response.data.token);
        navigate("/url-user", { state: { loginResponse: response.data } });

        if (!isAutoLogin) {
          showAlert("Success!", "success", "Login successful!");
        }
      } else {
        handleLoginError(
          response.data?.error || "Unknown error. Please try again."
        );
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 401) {
        handleLoginError("Incorrect Credentials. Please try again.");
      } else if (error.response?.status === 404) {
        handleLoginError("User not found");
      } else {
        handleLoginError("Network error. Please try again.");
      }
      console.error("Error logging in:", error);
    }
  };

  const handleLoginError = (errorMessage: string) => {
    localStorage.removeItem("jwtToken");
    const stored = sessionStorage.getItem("userCredentials");
    if (stored) {
      const creds = JSON.parse(stored);
      sessionStorage.setItem(
        "userCredentials",
        JSON.stringify({
          ...creds,
          autoLogin: false,
        })
      );
    }
    showAlert("Error", "error", errorMessage);
  };
  //endregion

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPassword(false);
    setLoading(true);

    const encryptedPassword = encryptData(credentials.password);
    const payload = {
      email: credentials.email,
      password: encryptedPassword,
    };

    sessionStorage.setItem(
      "userCredentials",
      JSON.stringify({
        email: credentials.email,
        password: encryptedPassword,
        rememberMe: isChecked,
        autoLogin: true, // Set to true for successful login
      })
    );

    await performLogin(payload);
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
            &nbsp;Remember me
          </label>
        </div>
        <button className="btn-primary" type="submit">
          Sign In
        </button>
      </form>
      <div className="or-section">
        <hr className="line" />
        <span className="or-text ">or</span>
        <hr className="line" />
      </div>
      <div className="bottomSection">
        <p className="underlineText" onClick={() => navigate("/forgot")}>
          Forgot Password
        </p>
        <p className="underlineText mobile-signup" onClick={onMobileSignup}>
          Sign Up
        </p>
      </div>
    </div>
  );
  //endregion
}

export default Signin;
