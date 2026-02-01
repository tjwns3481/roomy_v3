"use client";

import { Template } from "@/types";
import { cn } from "@/lib/utils/cn";

interface TemplateCardProps {
  template: Template;
  onSelect: (templateId: string) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const handleClick = () => {
    if (template.is_available) {
      onSelect(template.id);
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border-2 transition-all duration-200",
        template.is_available
          ? "cursor-pointer border-gray-200 hover:border-black hover:shadow-lg"
          : "cursor-not-allowed border-gray-100 opacity-60"
      )}
      onClick={handleClick}
    >
      {/* 인기 배지 */}
      {template.is_popular && template.is_available && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
          인기
        </div>
      )}

      {/* 썸네일 */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <div
          className={cn(
            "h-full w-full bg-gradient-to-br transition-transform duration-200",
            template.is_available && "group-hover:scale-105",
            getThumbnailGradient(template.id)
          )}
        />
      </div>

      {/* 정보 */}
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-bold">{template.name}</h3>
          {!template.is_available && (
            <span className="text-xs font-medium text-gray-400">준비중</span>
          )}
        </div>
        <p className="text-sm text-gray-600">{template.description}</p>

        {/* 선택 버튼 */}
        {template.is_available && (
          <div className="mt-4">
            <div
              className={cn(
                "rounded-md border-2 border-black bg-black py-2 text-center text-sm font-bold text-white transition-colors",
                "group-hover:bg-white group-hover:text-black"
              )}
            >
              선택하기
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 템플릿별 썸네일 그래디언트
function getThumbnailGradient(templateId: string): string {
  const gradients: Record<string, string> = {
    hotel: "from-blue-400 to-blue-600",
    pension: "from-green-400 to-green-600",
    airbnb: "from-red-400 to-pink-500",
    guesthouse: "from-yellow-400 to-orange-500",
    resort: "from-purple-400 to-purple-600",
    camping: "from-teal-400 to-cyan-600",
  };
  return gradients[templateId] || "from-gray-400 to-gray-600";
}
