/** @format */

import React, { forwardRef } from "react";
import ReactSelect, { Props as ReactSelectProps } from "react-select";

interface OptionType {
  value: string | number;
  label: string;
}

interface SelectProps
  extends Omit<ReactSelectProps<OptionType, boolean>, "classNames"> {
  label?: string;
  error?: string;
  helper?: string;
  options: OptionType[];
}

// Gaya khusus untuk ReactSelect yang PASTI bekerja
const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#a855f7" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #a855f7" : "none",
    borderRadius: "0.5rem",
    minHeight: "3rem",
    "&:hover": {
      borderColor: "#a855f7",
    },
  }),
  menu: () => ({
    backgroundColor: "white",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderRadius: "0.5rem",
    marginTop: "0.5rem",
    position: "absolute",
    width: "100%",
    zIndex: 100,
    overflow: "hidden",
  }),
  menuList: () => ({
    backgroundColor: "white",
    padding: "0.5rem",
    maxHeight: "300px",
    overflowY: "auto",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#a855f7"
      : state.isFocused
      ? "#f3e8ff"
      : "white",
    color: state.isSelected ? "white" : "#111827",
    padding: "0.75rem 1rem",
    cursor: "pointer",
    "&:active": {
      backgroundColor: state.isSelected ? "#a855f7" : "#e9d5ff",
    },
    ":hover": {
      backgroundColor: state.isSelected ? "#a855f7" : "#f3e8ff",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#9ca3af",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#111827",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#f3e8ff",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#a855f7",
    fontWeight: 500,
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#a855f7",
    "&:hover": {
      backgroundColor: "#ef4444",
      color: "white",
    },
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#111827",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#9ca3af",
    "&:hover": {
      color: "#a855f7",
    },
  }),
};

const Select = forwardRef<any, SelectProps>(
  ({ label, error, helper, options, className = "", ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}

        <ReactSelect
          ref={ref}
          options={options}
          className={`${className}`}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          styles={{
            ...customStyles,
            ...(error && {
              control: (base: any, state: any) => ({
                ...customStyles.control(base, state),
                borderColor: "#ef4444",
                "&:hover": {
                  borderColor: "#ef4444",
                },
              }),
            }),
          }}
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

Select.displayName = "Select";

export default Select;
