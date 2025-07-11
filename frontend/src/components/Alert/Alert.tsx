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
    CLOSE: "/close.svg",
    CLOSE_RED: "/close-red.svg",
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
}: AlertProps) {
  //region State
  const [show, setShow] = useState<boolean>(true);
  //endregion

  //region Icons
  const iconCloseWhite = STATIC_UI_IMAGES.ALERT.CLOSE;
  const iconCloseRed = STATIC_UI_IMAGES.ALERT.CLOSE_RED;
  const iconTick = STATIC_UI_IMAGES.ALERT.TICK;
  const iconError = STATIC_UI_IMAGES.ALERT.ERROR;
  const iconWarning = STATIC_UI_IMAGES.ALERT.WARNING;
  //endregion

  //region Effects
  useEffect(() => {
    setShow(true); // Always reset show when props change
  }, [message, subMessage, type]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(() => {
        handleClose(); // Call handleClose instead of setShow(false)
      }, timeout);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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

  const handleKeyUp = () => {
    // Placeholder for keyup handler
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

  const getCloseIcon = () => {
    return type === "success" ? iconCloseWhite : iconCloseRed;
  };
  //endregion

  //region UI
  if (!show) {
    return null;
  }

  return (
    <div className="parent-toast">
      <div className={`toast ${type}`}>
        <img src={getAlertIcon()} alt="" />
        <div>
          <span>{message}</span>
          {subMessage && subMessage.length > 0 && (
            <small>{ellipsis(subMessage, 100)}</small>
          )}
        </div>
        <button
          type="button"
          className="close-img"
          onClick={handleClose}
          onKeyUp={handleKeyUp}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <img src={getCloseIcon()} alt="Close" />
        </button>
      </div>
    </div>
  );
  //endregion
}

export default Alert;
