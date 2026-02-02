interface EditorPreviewProps {
  title?: string;
  children: React.ReactNode;
}

export function EditorPreview({ title = "미리보기", children }: EditorPreviewProps) {
  return (
    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
        {children}
      </div>
    </div>
  );
}
