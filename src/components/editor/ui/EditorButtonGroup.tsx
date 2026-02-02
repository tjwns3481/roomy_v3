import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface EditorButtonGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
}

export function EditorButtonGroup({ options, value, onChange, columns = 4 }: EditorButtonGroupProps) {
  return (
    <div className={cn(
      "grid gap-2",
      columns === 2 && "grid-cols-2",
      columns === 3 && "grid-cols-3",
      columns === 4 && "grid-cols-4"
    )}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            value === option.value
              ? "bg-primary text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          )}
        >
          {option.icon && (
            <span className="material-symbols-outlined text-[18px]">{option.icon}</span>
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
}
