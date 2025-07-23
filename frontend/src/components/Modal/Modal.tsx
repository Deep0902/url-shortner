import { useEffect, useRef } from "react";
import "./Modal.css";

interface ModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly children?: React.ReactNode;
}

// Global variable to track the topmost modal
let modalStack: (() => void)[] = [];

function Modal({ open, onClose, children }: ModalProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    // Add this modal's close function to the stack
    modalStack.push(onCloseRef.current);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Only close if this modal is the topmost one
        const topMostClose = modalStack[modalStack.length - 1];
        if (topMostClose === onCloseRef.current) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleEsc);
      // Remove this modal from the stack
      const index = modalStack.indexOf(onCloseRef.current);
      if (index > -1) {
        modalStack.splice(index, 1);
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
