interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function EmptyState({
  icon = 'description',
  title,
  description,
  ctaText,
  onCtaClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
        <span className="material-symbols-outlined text-5xl text-slate-400">
          {icon}
        </span>
      </div>

      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {ctaText && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {ctaText}
        </button>
      )}
    </div>
  );
}
