import { cn } from "@/lib/utils";

interface EditorTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function EditorTextarea({ error, className, ...props }: EditorTextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm transition-colors resize-none",
        "placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
          : "border-slate-200 dark:border-slate-700",
        className
      )}
      {...props}
    />
  );
}
