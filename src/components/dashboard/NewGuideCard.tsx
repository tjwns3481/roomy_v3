interface NewGuideCardProps {
  onClick?: () => void;
}

export function NewGuideCard({ onClick }: NewGuideCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 transition-all hover:border-primary hover:bg-primary/5 dark:hover:border-primary min-h-[280px]"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-3xl">add</span>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">
          새 가이드 만들기
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          새로운 게스트 가이드를 생성하세요
        </p>
      </div>
    </button>
  );
}
