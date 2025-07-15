import { Field, PinInput } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Particles from "../../Reactbits/Particles";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import "./ForgotPassword.css";

function ForgotPassword() {
  //region State
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  //endregion

  //region Steps
  const steps = [
    { label: "Email", description: "Enter your email" },
    { label: "OTP", description: "Enter OTP" },
    { label: "Password", description: "Set new password" },
  ];
  //endregion

  //region Form
  const {
    handleSubmit: handleOtpFormSubmit,
    control,
    formState,
  } = useForm({
    defaultValues: { pin: ["", "", "", "", "", ""] },
  });
  //endregion

  //region Handlers
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== "qwe@email.com") {
      setAlert({ show: true, message: "Email doesn't exist." });
      return;
    }
    setAlert({ show: false, message: "" });
    window.alert("Your OTP is 123456");
    setStep(2);
  };

  const handlePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({
      show: true,
      message: "Password successfully updated! Redirecting...",
    });
    setTimeout(() => navigate("/sign"), 3000);
  };
  //endregion

  //region UI
  return (
    <div className="forgot-content">
      <Navbar />
      {/* Chakra UI Steps Component */}
      <div className="steps-container">
        <div className="steps-row">
          {steps.map((s, idx) => (
            <div key={s.label} className="step-item">
              <div
                className={`step-circle${step === idx + 1 ? " active" : ""}`}
              >
                {idx + 1}
              </div>
              <div className={`step-label${step === idx + 1 ? " active" : ""}`}>
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
        {alert.show && (
          <div className="inputBox">
            <span style={{ color: "red" }}>{alert.message}</span>
          </div>
        )}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <span className="label">Forgot Password</span>
            <span className="subtext">Enter your email to receive an OTP.</span>
            <div className="inputBox">
              <input
                type="email"
                placeholder="Email (qwe@email.com)"
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
          <form
            onSubmit={handleOtpFormSubmit((data: { pin: string[] }) => {
              const otpValue = data.pin.join("");
              setOtp(otpValue);
              if (otpValue !== "123456") {
                setAlert({ show: true, message: "Invalid OTP." });
                return;
              }
              setAlert({ show: false, message: "" });
              setStep(3);
            })}
          >
            <span className="label">Enter OTP</span>
            <span className="subtext">Check your email for the OTP.</span>
            <Field.Root invalid={!!formState.errors.pin}>
              <Controller
                control={control}
                name="pin"
                render={({
                  field,
                }: {
                  field: { value: string[]; onChange: (val: any) => void };
                }) => (
                  <PinInput.Root
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (
                        e.key === "Enter" &&
                        field.value.every((v) => v.length === 1)
                      ) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) {
                          form.dispatchEvent(
                            new Event("submit", {
                              cancelable: true,
                              bubbles: true,
                            })
                          );
                        }
                      }
                    }}
                  >
                    <PinInput.HiddenInput />
                    <PinInput.Control>
                      <PinInput.Input index={0} autoFocus />
                      <PinInput.Input index={1} />
                      <PinInput.Input index={2} />
                      <PinInput.Input index={3} />
                      <PinInput.Input index={4} />
                      <PinInput.Input index={5} />
                    </PinInput.Control>
                  </PinInput.Root>
                )}
              />
              <Field.ErrorText>{formState.errors.pin?.message}</Field.ErrorText>
            </Field.Root>
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
      <Footer />
      <div className="particles-bg">
        <Particles />
      </div>
    </div>
  );
  //endregion
}

export default ForgotPassword;
