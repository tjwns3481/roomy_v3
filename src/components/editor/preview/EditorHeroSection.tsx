"use client";

interface EditorHeroSectionProps {
  image?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
}

export function EditorHeroSection({
  image,
  title,
  subtitle,
  badge = "Premium Stay",
  onClick,
}: EditorHeroSectionProps) {
  // 이미지가 없을 때 빈 상태
  if (!image) {
    return (
      <div className="px-4 py-2">
        <button
          onClick={onClick}
          className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all group"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-500 transition-colors text-6xl">
              add_photo_alternate
            </span>
            <p className="text-slate-500 font-medium group-hover:text-slate-600 transition-colors">
              메인 이미지를 추가하세요
            </p>
          </div>
        </button>
      </div>
    );
  }

  // 이미지가 있을 때 Hero Section
  return (
    <div className="px-4 py-2">
      <button
        onClick={onClick}
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-soft group cursor-pointer"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start justify-end">
          {/* Badge */}
          <span className="inline-block px-3 py-1 mb-3 rounded-full bg-guest-primary/90 backdrop-blur-sm text-slate-900 text-xs font-bold tracking-wide uppercase">
            {badge}
          </span>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-white/90 text-sm font-medium mb-1 tracking-wide">
              {subtitle}
            </p>
          )}

          {/* Title */}
          {title && (
            <h2 className="text-white text-3xl font-bold leading-tight drop-shadow-sm">
              {title}
            </h2>
          )}
        </div>

        {/* Edit Indicator on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="material-symbols-outlined text-slate-700 text-xl align-middle mr-1">
              edit
            </span>
            <span className="text-slate-700 font-bold text-sm">편집하기</span>
          </div>
        </div>
      </button>
    </div>
  );
}
