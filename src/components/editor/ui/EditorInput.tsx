import { cn } from "@/lib/utils";

interface EditorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: string;
  rightElement?: React.ReactNode;
  error?: boolean;
}

export function EditorInput({ leftIcon, rightElement, error, className, ...props }: EditorInputProps) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-400">
          {leftIcon}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm transition-colors",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          leftIcon && "pl-10",
          rightElement && "pr-10",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-200 dark:border-slate-700",
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  );
}
