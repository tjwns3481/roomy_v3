interface GuestLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "gradient";
}

export function GuestLayout({
  children,
  variant = "default",
}: GuestLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* 모바일 퍼스트 컨테이너 */}
      <div
        className={`mx-auto max-w-[428px] ${
          variant === "gradient"
            ? "bg-gradient-to-b from-slate-50 to-white"
            : "bg-white"
        }`}
      >
        {/* 안전한 영역 padding (iOS 노치 대응) */}
        <div className="px-4 pb-safe">{children}</div>
      </div>
    </div>
  );
}
