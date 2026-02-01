"use client";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-guest-background-light/80 backdrop-blur-md">
      <div className="flex items-center justify-between p-4 pb-2">
        {/* Villa Icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-slate-900">
          <span className="material-symbols-outlined">villa</span>
        </div>

        {/* Guide Title */}
        <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          {title}
        </h1>

        {/* Notification Button */}
        <div className="flex size-10 items-center justify-center">
          <button className="relative flex items-center justify-center rounded-full size-10 hover:bg-black/5 transition-colors">
            <span className="material-symbols-outlined text-slate-900">
              notifications
            </span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-guest-background-light"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
