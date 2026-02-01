import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="text-[#111518] dark:text-gray-200 text-sm font-bold">
          {label}
        </span>
      )}
      <div className="relative">
        <input
          className={`
            w-full h-12 px-4 rounded-lg border
            ${
              props.readOnly
                ? "border-none bg-[#f3f4f6] dark:bg-[#111827] text-[#617989] dark:text-gray-400 cursor-not-allowed"
                : "border-[#dbe1e6] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] text-[#111518] dark:text-white"
            }
            ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-[#2b9dee] focus:border-[#2b9dee]"}
            focus:outline-none focus:ring-2 transition-shadow
            ${className}
          `}
          {...props}
        />
        {props.readOnly && (
          <span
            className="material-symbols-outlined absolute right-3 top-3 text-gray-400"
            style={{ fontSize: "20px" }}
          >
            lock
          </span>
        )}
      </div>
      {helperText && !error && (
        <p className="text-[#617989] dark:text-gray-400 text-sm flex items-center gap-1">
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontSize: "16px" }}
          >
            info
          </span>
          {helperText}
        </p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </label>
  );
}
