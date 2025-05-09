/** @format */

import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  // Size classes mapping
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  // Handle modal open/close
  useEffect(() => {
    const modalElement = modalRef.current;

    if (isOpen) {
      modalElement?.showModal();
      document.body.classList.add("modal-open");
    } else {
      modalElement?.close();
      document.body.classList.remove("modal-open");
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  // Handle clicking outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = modalRef.current?.getBoundingClientRect();

    if (dialogDimensions) {
      const { clientX, clientY } = e;
      const { top, right, bottom, left } = dialogDimensions;

      // Check if click is outside the modal
      if (
        clientX < left ||
        clientX > right ||
        clientY < top ||
        clientY > bottom
      ) {
        onClose();
      }
    }
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      className={`modal modal-bottom sm:modal-middle ${
        isOpen ? "modal-open" : ""
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`modal-box ${sizeClasses[size]}`}>
        {/* Close button */}
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>

        {/* Title */}
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}

        {/* Content */}
        <div className="modal-content">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-action">{footer}</div>}
      </div>
    </dialog>
  );
};

export default Modal;
