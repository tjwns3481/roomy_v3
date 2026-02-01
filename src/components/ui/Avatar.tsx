// @TASK P0-T0.3 - 기본 UI 컴포넌트 구현 (Avatar)
// @SPEC specs/shared/components.yaml#avatar

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  icon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline";
}

const avatarSizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const statusSizes = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { src, name, icon, size = "md", status, className, ...props },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const showImage = src && !imageError;
    const showInitials = !showImage && name && !icon;
    const showIcon = !showImage && !showInitials && icon;
    const showPlaceholder = !showImage && !showInitials && !showIcon;

    return (
      <div ref={ref} className={cn("relative inline-block", className)} {...props}>
        <div
          className={cn(
            "flex items-center justify-center rounded-full overflow-hidden bg-gray-200 text-gray-600 font-semibold",
            avatarSizes[size]
          )}
        >
          {showImage && (
            <Image
              src={src!}
              alt={name || "Avatar"}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
          {showInitials && <span>{getInitials(name!)}</span>}
          {showIcon && <div>{icon}</div>}
          {showPlaceholder && (
            <svg
              className="w-1/2 h-1/2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Status Indicator */}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-white",
              statusSizes[size],
              status === "online" ? "bg-green-500" : "bg-gray-400"
            )}
            aria-label={status === "online" ? "온라인" : "오프라인"}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
