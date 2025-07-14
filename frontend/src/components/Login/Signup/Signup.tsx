import axios from "axios";
import { useState } from "react";
import { API_KEY, API_URL } from "../../../shared/constants";
import type { AlertState } from "../../../shared/interfaces";
import "./Signup.css";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

// Add your secret key here (should be the same as in backend)
const SECRET_KEY = API_KEY; // Replace with your actual secret key

interface SignUnProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  alert: AlertState;
  setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
}

function Signup({ setLoading, setAlert }: Readonly<SignUnProps>) {
  //region State
  const [userDetails, setUserDetails] = useState({
    password: "",
    confirm_pass: "",
    email: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  //endregion

  //region Encryption Helper
  const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  };
  //endregion

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

  //region Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (userDetails.password != userDetails.confirm_pass) {
      showAlert("Try Again", "error", "Passwords don't match!");
      return;
    }
    console.log("Sign up submitted with credentials:", userDetails);

    // Encrypt the password before sending
    const encryptedPassword = encryptData(userDetails.password);

    const payload = {
      email: userDetails.email,
      password: encryptedPassword, // Send encrypted password
      username: userDetails.username,
    };

    axios
      .post(`${API_URL}/api/users`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setLoading(false);
        if (
          response.status == 201 &&
          response.data.message === "User created successfully"
        ) {
          showAlert("Success!", "success", "User successfully Created!");
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
        if (error.response && error.response.status === 409) {
          showAlert("Oops", "warning", "User Already Exists!");
        } else if (error.response && error.response.status === 401) {
          showAlert(
            "Error",
            "error",
            "Incorrect Credentials. Please try again."
          );
        } else {
          showAlert("Error", "error", "Server error");
        }
        console.error("Error creating user:", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordView = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  //endregion

  //region UI
  return (
    <div className="credentialsCard">
      <label className="">Sign Up</label>
      <span className=" subtext">Sign Up to enjoy the features!</span>

      <form onSubmit={handleSubmit}>
        <div className="inputBox">
          <input
            type="text"
            className="form-control "
            name="username"
            value={userDetails.username}
            onChange={handleChange}
            required
            placeholder="User Name"
          />
        </div>
        <div className="inputBox">
          <input
            type="email"
            className="form-control "
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="inputBox">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control "
            name="password"
            value={userDetails.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <span className="toggle-button" onClick={handlePasswordView}>
            👁️
          </span>
        </div>
        <div className="inputBox">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="form-control "
            name="confirm_pass"
            value={userDetails.confirm_pass}
            onChange={handleChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
          />
          <span className="toggle-button" onClick={handleConfirmPasswordView}>
            👁️
          </span>
        </div>

        <button className="btn" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
  //endregion
}

export default Signup;
