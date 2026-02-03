import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onEscape,
}: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierKey = isMac ? event.metaKey : event.ctrlKey;

      // 입력 필드에서는 단축키 무시
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Escape만 허용
        if (event.key === "Escape" && onEscape) {
          onEscape();
        }
        return;
      }

      // Ctrl/Cmd + S: 저장
      if (modifierKey && event.key === "s") {
        event.preventDefault();
        onSave?.();
        return;
      }

      // Ctrl/Cmd + Z: 실행취소
      if (modifierKey && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        onUndo?.();
        return;
      }

      // Ctrl/Cmd + Shift + Z 또는 Ctrl/Cmd + Y: 다시실행
      if (
        (modifierKey && event.shiftKey && event.key === "z") ||
        (modifierKey && event.key === "y")
      ) {
        event.preventDefault();
        onRedo?.();
        return;
      }

      // Delete 또는 Backspace: 삭제
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        onDelete?.();
        return;
      }

      // Ctrl/Cmd + D: 복제
      if (modifierKey && event.key === "d") {
        event.preventDefault();
        onDuplicate?.();
        return;
      }

      // Escape: 선택 해제
      if (event.key === "Escape") {
        onEscape?.();
        return;
      }
    },
    [onSave, onUndo, onRedo, onDelete, onDuplicate, onEscape]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
