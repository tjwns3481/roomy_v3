"use client";

interface GuestLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "gradient";
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  showQuickAccess?: boolean;
}

export function GuestLayout({
  children,
  variant = "default",
  heroImage,
  heroTitle,
  heroSubtitle,
  showQuickAccess = true,
}: GuestLayoutProps) {
  const quickAccessItems = [
    { icon: "wifi", label: "Wi-Fi", color: "blue" },
    { icon: "home", label: "House Info", color: "orange" },
    { icon: "gavel", label: "Rules", color: "purple" },
    { icon: "restaurant", label: "Local Food", color: "red" },
    { icon: "map", label: "Map", color: "green" },
    { icon: "call", label: "Contact", color: "gray" },
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-500",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-500",
    red: "bg-red-50 text-red-500",
    green: "bg-green-50 text-green-500",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-guest-background-light overflow-x-hidden pb-24">
      {/* Main Container */}
      <div className="mx-auto max-w-[428px]">
        {/* Content */}
        {children}

        {/* Hero Section */}
        {heroImage && (
          <div className="px-4 py-2">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-soft group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start justify-end">
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-guest-primary/90 backdrop-blur-sm text-slate-900 text-xs font-bold tracking-wide uppercase">
                  Premium Stay
                </span>
                {heroSubtitle && (
                  <p className="text-white/90 text-sm font-medium mb-1 tracking-wide">
                    {heroSubtitle}
                  </p>
                )}
                {heroTitle && (
                  <h2 className="text-white text-3xl font-bold leading-tight drop-shadow-sm">
                    {heroTitle}
                  </h2>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Grid */}
        {showQuickAccess && (
          <div className="p-4 pt-6">
            <h3 className="text-slate-900 text-lg font-bold mb-4 px-1">
              Quick Access
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {quickAccessItems.map((item) => (
                <button
                  key={item.label}
                  className="bg-guest-surface-light p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 aspect-square active:scale-95 transition-transform"
                >
                  <div
                    className={`size-10 rounded-full ${
                      colorClasses[item.color as keyof typeof colorClasses]
                    } flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-slate-700 text-xs font-bold">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Chat FAB */}
        <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-2">
          <div
            className="bg-guest-surface-light text-slate-900 px-4 py-2 rounded-xl shadow-lg border border-slate-100 relative animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            <p className="text-sm font-medium">뭐든 물어보세요!</p>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-guest-surface-light border-b border-r border-slate-100 rotate-45"></div>
          </div>
          <button className="size-16 rounded-full bg-guest-primary hover:bg-cyan-400 text-slate-900 shadow-lg shadow-guest-primary/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
              chat_bubble
            </span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-5 pt-2 px-6 z-40">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <button className="flex flex-col items-center gap-1 w-16 group">
              <span className="material-symbols-outlined text-slate-900 font-bold group-hover:text-guest-primary transition-colors">
                home
              </span>
              <span className="text-[10px] font-medium text-slate-900 group-hover:text-guest-primary">
                Home
              </span>
            </button>
            <button className="flex flex-col items-center gap-1 w-16 group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-guest-primary transition-colors">
                explore
              </span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-guest-primary">
                Explore
              </span>
            </button>
            <button className="flex flex-col items-center gap-1 w-16 group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-guest-primary transition-colors">
                mail
              </span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-guest-primary">
                Inbox
              </span>
            </button>
            <button className="flex flex-col items-center gap-1 w-16 group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-guest-primary transition-colors">
                person
              </span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-guest-primary">
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
