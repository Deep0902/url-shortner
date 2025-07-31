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
  const [showPassword, setShowPassword] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  //endregion

  //region Auto-login from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem("userCredentials");
    if (stored) {
      const creds = JSON.parse(stored) as { email: string; password: string };
      // Decrypt the password before setting it in state
      let decryptedPassword = "";
      try {
        const bytes = CryptoJS.AES.decrypt(creds.password, SECRET_KEY);
        decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      } catch {
        decryptedPassword = "";
      }
      setCredentials({ email: creds.email, password: decryptedPassword });
    }
  }, []);
  // useEffect(() => {
  //   const stored = sessionStorage.getItem("userCredentials");
  //   if (stored) {
  //     const creds = JSON.parse(stored) as { email: string; password: string };
  //     // Decrypt the password before using
  //     let decryptedPassword = "";
  //     try {
  //       const bytes = CryptoJS.AES.decrypt(creds.password, SECRET_KEY);
  //       decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
  //     } catch {
  //       decryptedPassword = "";
  //     }
  //     if (creds.email && decryptedPassword) {
  //       // setAutoLoginLoading(true);
  //       const payload = {
  //         email: creds.email,
  //         password: creds.password, // Send encrypted password
  //       };
  //       axios
  //         .post(`${API_URL}/api/login`, payload, {
  //           headers: { "x-api-key": API_KEY },
  //         })
  //         .then((response) => {
  //           // setAutoLoginLoading(false);
  //           if (response.data && response.data.message === "Login successful") {
  //             showAlert("Success!", "success", "Login successful!");
  //             navigate("/url-user", {
  //               state: { loginResponse: response.data },
  //             });
  //           }
  //         })
  //         .catch(() => {
  //           // setAutoLoginLoading(false);
  //           // Do nothing, let user proceed with login
  //         });
  //     }
  //   }
  // }, []);
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
    setShowPassword(false);
    setLoading(true);

    // Encrypt the password before sending
    const encryptedPassword = encryptData(credentials.password);

    const payload = {
      email: credentials.email,
      password: encryptedPassword, // Send encrypted password
    };

    // Save credentials to session storage if 'Keep Me Logged In' is checked
    if (isChecked) {
      sessionStorage.setItem(
        "userCredentials",
        JSON.stringify({
          email: credentials.email,
          password: encryptedPassword, // Store encrypted password
        })
      );
    } else {
      sessionStorage.removeItem("userCredentials");
    }

    axios
      .post(`${API_URL}/api/login`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setLoading(false);
        if (response.data && response.data.message === "Login successful") {
          showAlert("Success!", "success", "Login successful!");
          navigate("/url-user", { state: { loginResponse: response.data } });
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
            &nbsp;Remember me
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
