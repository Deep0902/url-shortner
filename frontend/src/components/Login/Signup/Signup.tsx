import { useState } from "react";
import "./Signup.css";

function Signup() {
  //region State
  const [userDetails, setUserDetails] = useState({
    user_pass: "",
    confirm_pass: "",
    user_email: "",
    user_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //endregion

  //region Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up submitted with credentials:", userDetails);
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
            name="user_name"
            value={userDetails.user_name}
            onChange={handleChange}
            required
            placeholder="User Name"
          />
        </div>
        <div className="inputBox">
          <input
            type="email"
            className="form-control "
            name="user_email"
            value={userDetails.user_email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="inputBox">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control "
            name="user_pass"
            value={userDetails.user_pass}
            onChange={handleChange}
            placeholder="Password"
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
