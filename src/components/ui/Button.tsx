/** @format */

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "ghost"
    | "link";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  outline = false,
  className = "",
  disabled,
  ...props
}) => {
  // Construct class names based on props
  const variantClass = outline
    ? `btn-outline btn-${variant}`
    : `btn-${variant}`;

  const sizeClass = size === "md" ? "" : `btn-${size}`;

  const classes = `btn ${variantClass} ${sizeClass} ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </>
      )}
      {!isLoading && children}
    </button>
  );
};

export default Button;
