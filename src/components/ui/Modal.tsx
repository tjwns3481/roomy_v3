// @TASK P0-T0.3 - 기본 UI 컴포넌트 구현 (Modal)
// @SPEC specs/shared/components.yaml#modal

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  width?: "sm" | "md" | "lg";
  closable?: boolean;
  overlay?: boolean;
  children: React.ReactNode;
  className?: string;
}

const modalWidths = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      width = "md",
      closable = true,
      overlay = true,
      children,
      className,
    },
    ref
  ) => {
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && closable) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, closable, onClose]);

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            {overlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closable ? onClose : undefined}
                aria-hidden="true"
              />
            )}

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className={cn(
                  "bg-white rounded-lg shadow-xl w-full",
                  modalWidths[width],
                  className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2
                    id="modal-title"
                    className="text-xl font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                  {closable && (
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label="닫기"
                    >
                      <svg
                        className="w-6 h-6"
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
                  )}
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = "Modal";
