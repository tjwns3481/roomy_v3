import { cn } from "@/lib/utils";

interface EditorSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function EditorSection({ title, description, children, className }: EditorSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
