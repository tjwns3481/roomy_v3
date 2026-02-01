// @TASK P0-T0.3 - 기본 UI 컴포넌트 구현 (Toast)
// @SPEC specs/shared/components.yaml#toast

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface ToastProps {
  message: string;
  variant?: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

const toastVariants = {
  success: {
    bg: "bg-green-50 border-green-500",
    icon: "text-green-500",
    text: "text-green-900",
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    ),
  },
  error: {
    bg: "bg-red-50 border-red-500",
    icon: "text-red-500",
    text: "text-red-900",
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ),
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-500",
    icon: "text-yellow-500",
    text: "text-yellow-900",
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
  },
  info: {
    bg: "bg-blue-50 border-blue-500",
    icon: "text-blue-500",
    text: "text-blue-900",
    iconPath: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { message, variant = "info", duration = 3000, action, onClose },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const variantStyles = toastVariants[variant];

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onClose?.();
          }, 300);
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg max-w-md",
              variantStyles.bg
            )}
            role="alert"
          >
            {/* Icon */}
            <svg
              className={cn("w-5 h-5 flex-shrink-0", variantStyles.icon)}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {variantStyles.iconPath}
            </svg>

            {/* Message */}
            <p className={cn("flex-1 text-sm font-medium", variantStyles.text)}>
              {message}
            </p>

            {/* Action */}
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  "text-sm font-semibold hover:underline",
                  variantStyles.text
                )}
              >
                {action.label}
              </button>
            )}

            {/* Close */}
            <button
              onClick={handleClose}
              className={cn(
                "flex-shrink-0 hover:opacity-70 transition-opacity",
                variantStyles.icon
              )}
              aria-label="닫기"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Toast.displayName = "Toast";

// Toast Container Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState<
    Array<ToastProps & { id: string }>
  >([]);

  const showToast = React.useCallback(
    (props: Omit<ToastProps, "onClose">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...props, id }]);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = React.useCallback(
    () => (
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    ),
    [toasts, removeToast]
  );

  return { showToast, ToastContainer };
};
