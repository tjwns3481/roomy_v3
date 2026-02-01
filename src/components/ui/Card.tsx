import React from "react";

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
}

const variantStyles = {
  default: "bg-white dark:bg-[#1a2632] shadow-sm border border-[#e5e7eb] dark:border-[#2d3748]",
  elevated: "bg-white dark:bg-[#1a2632] shadow-lg border border-[#e5e7eb] dark:border-[#2d3748]",
  outlined: "bg-transparent border-2 border-[#2b9dee] dark:border-[#2b9dee]",
};

export function Card({ title, subtitle, children, className = "", variant = "default" }: CardProps) {
  return (
    <section
      className={`${variantStyles[variant]} rounded-xl overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="p-6 border-b border-[#e5e7eb] dark:border-[#2d3748]">
          {title && (
            <h2 className="text-xl font-bold text-[#111518] dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-[#60758a] dark:text-[#9ca3af] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}
