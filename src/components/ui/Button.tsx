import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles = {
  primary:
    "bg-[#2b9dee] hover:bg-[#2b9dee]/90 text-white font-bold shadow-sm",
  secondary:
    "bg-[#f0f3f4] hover:bg-[#e5e7eb] dark:bg-[#2d3748] dark:hover:bg-[#374151] text-[#111518] dark:text-white font-semibold",
  ghost:
    "bg-transparent text-[#617989] dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-semibold",
  danger:
    "bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  isLoading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg transition-all active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "처리 중..." : children}
    </button>
  );
}
