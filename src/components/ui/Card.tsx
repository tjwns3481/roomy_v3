import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden ${className}`}
    >
      {title && (
        <div className="p-6 border-b border-[#e5e7eb] dark:border-[#2d3748]">
          <h2 className="text-xl font-bold text-[#111518] dark:text-white">
            {title}
          </h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}
