"use client";

interface EditorChatFABProps {
  disabled?: boolean;
}

export function EditorChatFAB({ disabled = true }: EditorChatFABProps) {
  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-2">
      <div
        className="bg-guest-surface-light text-slate-900 px-4 py-2 rounded-xl shadow-lg border border-slate-100 relative animate-bounce"
        style={{ animationDuration: "2s" }}
      >
        <p className="text-sm font-medium">뭐든 물어보세요!</p>
        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-guest-surface-light border-b border-r border-slate-100 rotate-45"></div>
      </div>
      <button
        className={`size-16 rounded-full bg-guest-primary text-slate-900 shadow-lg shadow-guest-primary/30 flex items-center justify-center transition-all ${
          disabled
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-cyan-400 hover:scale-105 active:scale-95"
        }`}
        disabled={disabled}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          chat_bubble
        </span>
      </button>
    </div>
  );
}
