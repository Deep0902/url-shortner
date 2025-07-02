import { useState, useEffect } from 'react';
import "./Alert.css";

interface AlertProps {
  message: string;
  subMessage?: string;
  type?: 'success' | 'error' | 'warning';
  timeout?: number;
  onClose?: () => void;
}

// Icon constants - using the actual icon paths from your public folder
const STATIC_UI_IMAGES = {
  ALERT: {
    CLOSE: '/close.svg',
    CLOSE_RED: '/close-red.svg',
    TICK: '/tick.svg',
    ERROR: '/error-toast.svg',
    WARNING: '/warning-toast.svg'
  }
};

function Alert({ 
  message, 
  subMessage = '', 
  type = 'success', 
  timeout,
  onClose 
}: AlertProps) {
  const [show, setShow] = useState<boolean>(true);

  const iconCloseWhite = STATIC_UI_IMAGES.ALERT.CLOSE;
  const iconCloseRed = STATIC_UI_IMAGES.ALERT.CLOSE_RED;
  const iconTick = STATIC_UI_IMAGES.ALERT.TICK;
  const iconError = STATIC_UI_IMAGES.ALERT.ERROR;
  const iconWarning = STATIC_UI_IMAGES.ALERT.WARNING;

  useEffect(() => {
    let timeoutId: number;
    
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(() => setShow(false), timeout);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeout]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  const handleKeyUp = () => {
    // Placeholder for keyup handler
  };

  // Helper function to truncate text (equivalent to ellipsis pipe)
  const ellipsis = (text: string, limit: number): string => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const getAlertIcon = () => {
    if (type === 'success') return iconTick;
    if (type === 'error') return iconError;
    if (type === 'warning') return iconWarning;
    return '';
  };

  const getCloseIcon = () => {
    return type === 'success' ? iconCloseWhite : iconCloseRed;
  };

  if (!show) {
    return null;
  }

  return (
    <div className="parent-toast">
      <div className={`toast ${type}`}>
        <img
          src={getAlertIcon()}
          alt=""
        />
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
            background: 'none', 
            border: 'none', 
            padding: 0,
            cursor: 'pointer' 
          }}
        >
          <img
            src={getCloseIcon()}
            alt="Close"
          />
        </button>
      </div>
    </div>
  );
}

export default Alert;
