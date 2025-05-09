/** @format */

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helper, leftIcon, rightIcon, className = "", ...props },
    ref
  ) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`input input-bordered w-full ${
              error ? "input-error" : ""
            } ${leftIcon ? "pl-10" : ""} ${
              rightIcon ? "pr-10" : ""
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helper) && (
          <label className="label">
            {error && (
              <span className="label-text-alt text-error">{error}</span>
            )}
            {!error && helper && (
              <span className="label-text-alt">{helper}</span>
            )}
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
