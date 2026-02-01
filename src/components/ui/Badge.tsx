// @TASK P0-T0.3 - 기본 UI 컴포넌트 구현 (Badge)
// @SPEC specs/shared/components.yaml#badge

"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
}

const badgeVariants = {
  default: "bg-gray-100 text-gray-800 border-gray-300",
  success: "bg-green-100 text-green-800 border-green-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  danger: "bg-red-100 text-red-800 border-red-300",
  info: "bg-blue-100 text-blue-800 border-blue-300",
};

const dotColors = {
  default: "bg-gray-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", dot = false, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
          badgeVariants[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn("w-2 h-2 rounded-full", dotColors[variant])}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
