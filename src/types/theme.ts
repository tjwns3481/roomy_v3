export interface GuideTheme {
  // 기본 색상
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;

  // 폰트
  fontFamily: "default" | "serif" | "mono";

  // 둥근 모서리
  borderRadius: "none" | "sm" | "md" | "lg" | "full";

  // 다크모드
  darkMode: boolean;
}

export const defaultTheme: GuideTheme = {
  primaryColor: "#FACC15", // yellow-400
  backgroundColor: "#F8FAFC", // slate-50
  surfaceColor: "#FFFFFF",
  textColor: "#0F172A", // slate-900
  fontFamily: "default",
  borderRadius: "lg",
  darkMode: false,
};

export const themePresets: Record<string, GuideTheme> = {
  default: defaultTheme,
  ocean: {
    primaryColor: "#0EA5E9", // sky-500
    backgroundColor: "#F0F9FF", // sky-50
    surfaceColor: "#FFFFFF",
    textColor: "#0C4A6E", // sky-900
    fontFamily: "default",
    borderRadius: "lg",
    darkMode: false,
  },
  forest: {
    primaryColor: "#22C55E", // green-500
    backgroundColor: "#F0FDF4", // green-50
    surfaceColor: "#FFFFFF",
    textColor: "#14532D", // green-900
    fontFamily: "default",
    borderRadius: "md",
    darkMode: false,
  },
  sunset: {
    primaryColor: "#F97316", // orange-500
    backgroundColor: "#FFF7ED", // orange-50
    surfaceColor: "#FFFFFF",
    textColor: "#7C2D12", // orange-900
    fontFamily: "serif",
    borderRadius: "lg",
    darkMode: false,
  },
  midnight: {
    primaryColor: "#A78BFA", // violet-400
    backgroundColor: "#1E1B4B", // indigo-950
    surfaceColor: "#312E81", // indigo-900
    textColor: "#E0E7FF", // indigo-100
    fontFamily: "default",
    borderRadius: "lg",
    darkMode: true,
  },
  minimal: {
    primaryColor: "#18181B", // zinc-900
    backgroundColor: "#FFFFFF",
    surfaceColor: "#FAFAFA", // zinc-50
    textColor: "#18181B", // zinc-900
    fontFamily: "mono",
    borderRadius: "none",
    darkMode: false,
  },
};
