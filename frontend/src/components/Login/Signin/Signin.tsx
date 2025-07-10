import { useState } from "react";
import "./Signin.css";

function Signin() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in submitted with credentials:", credentials);
  };
  const [credentials, setCredentials] = useState<{
    user_email: string;
    user_pass: string;
  }>({
    user_email: "",
    user_pass: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
              value={credentials.user_email}
            />
          </div>
          <div className="inputBox">
            <input
              type={showPassword ? "text" : "password"}
              value={credentials.user_pass}
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
