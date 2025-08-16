import { useEffect, useState } from "react";
import "./Alert.css";

//region Types
interface AlertProps {
  message: string;
  subMessage?: string;
  type?: "success" | "error" | "warning";
  timeout?: number;
  onClose?: () => void;
}
//endregion

//region Constants
const STATIC_UI_IMAGES = {
  ALERT: {
    TICK: "/tick.svg",
    ERROR: "/error-toast.svg",
    WARNING: "/warning-toast.svg",
  },
};
//endregion

function Alert({
  message,
  subMessage = "",
  type = "success",
  timeout,
  onClose,
}: Readonly<AlertProps>) {
  //region State
  const [show, setShow] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(100);
  //endregion
  //endregion

  //region Icons
  const iconTick = STATIC_UI_IMAGES.ALERT.TICK;
  const iconError = STATIC_UI_IMAGES.ALERT.ERROR;
  const iconWarning = STATIC_UI_IMAGES.ALERT.WARNING;
  //endregion

  //region Effects
  useEffect(() => {
    setShow(true);
    setProgress(100); // Reset progress when props change
  }, [message, subMessage, type]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    if (timeout && timeout > 0) {
      // Update progress every 50ms for smooth animation
      const updateInterval = 50;
      const steps = timeout / updateInterval;
      let currentStep = 0;

      intervalId = setInterval(() => {
        currentStep++;
        const newProgress = ((steps - currentStep) / steps) * 100;
        setProgress(Math.max(0, newProgress));
      }, updateInterval);

      timeoutId = setTimeout(() => {
        handleClose();
      }, timeout);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [timeout]);
  //endregion

  //region Handlers
  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };
  //endregion

  //region Helpers
  const ellipsis = (text: string, limit: number): string => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const getAlertIcon = () => {
    if (type === "success") return iconTick;
    if (type === "error") return iconError;
    if (type === "warning") return iconWarning;
    return "";
  };

  //endregion

  //region UI
  if (!show) {
    return null;
  }

  return (
    <div className="parent-toast">
      <div className={`toast ${type}`}>
        <img src={getAlertIcon()} alt="" className="alert-icon" />
        <div className="message-content">
          {/* <span>{message}</span> */}
          {subMessage && subMessage.length > 0 && (
            <small>{ellipsis(subMessage, 100)}</small>
          )}
        </div>
        {timeout && timeout > 0 && (
          <div className="progress-container">
            <div className="progress-line" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
  //endregion
  //endregion
}

export default Alert;
