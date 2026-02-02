"use client";

interface EditorBottomNavProps {
  activeTab?: "home" | "explore" | "inbox" | "profile";
}

export function EditorBottomNav({
  activeTab = "home",
}: EditorBottomNavProps) {
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "explore", icon: "explore", label: "Explore" },
    { id: "inbox", icon: "mail", label: "Inbox" },
    { id: "profile", icon: "person", label: "Profile" },
  ] as const;

  return (
    <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-5 pt-2 px-6 z-40">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className="flex flex-col items-center gap-1 w-16 group opacity-50 cursor-not-allowed"
              disabled
            >
              <span
                className={`material-symbols-outlined transition-colors ${
                  isActive
                    ? "text-slate-900 font-bold"
                    : "text-slate-400"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
