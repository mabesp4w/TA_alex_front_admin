/** @format */

import React, { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, className = "", ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}

        <textarea
          ref={ref}
          className={`textarea textarea-bordered w-full ${
            error ? "textarea-error" : ""
          } ${className}`}
          {...props}
        />

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

Textarea.displayName = "Textarea";

export default Textarea;
