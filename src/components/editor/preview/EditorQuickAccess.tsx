"use client";

interface QuickAccessItem {
  type: string;
  icon: string;
  label: string;
  color: "blue" | "orange" | "purple" | "red" | "green" | "gray";
}

interface EditorQuickAccessProps {
  items?: QuickAccessItem[];
  onItemClick?: (type: string) => void;
}

const defaultItems: QuickAccessItem[] = [
  { type: "wifi", icon: "wifi", label: "Wi-Fi", color: "blue" },
  { type: "info", icon: "home", label: "House Info", color: "orange" },
  { type: "rules", icon: "gavel", label: "Rules", color: "purple" },
  { type: "places", icon: "restaurant", label: "Local Food", color: "red" },
  { type: "map", icon: "map", label: "Map", color: "green" },
  { type: "contact", icon: "call", label: "Contact", color: "gray" },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-500",
  orange: "bg-orange-50 text-orange-500",
  purple: "bg-purple-50 text-purple-500",
  red: "bg-red-50 text-red-500",
  green: "bg-green-50 text-green-500",
  gray: "bg-gray-50 text-gray-600",
};

export function EditorQuickAccess({
  items = defaultItems,
  onItemClick,
}: EditorQuickAccessProps) {
  return (
    <div className="p-4 pt-6">
      <h3 className="text-slate-900 text-lg font-bold mb-4 px-1">
        Quick Access
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <button
            key={item.type}
            onClick={() => onItemClick?.(item.type)}
            className="bg-guest-surface-light p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 aspect-square active:scale-95 transition-transform hover:shadow-md"
          >
            <div
              className={`size-10 rounded-full ${
                colorClasses[item.color]
              } flex items-center justify-center`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <span className="text-slate-700 text-xs font-bold">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
