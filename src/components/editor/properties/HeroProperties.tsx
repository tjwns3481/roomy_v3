"use client";

import { useState } from "react";

export interface HeroData {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
}

interface HeroPropertiesProps {
  data: HeroData;
  onUpdate: (data: Partial<HeroData>) => void;
}

export function HeroProperties({ data, onUpdate }: HeroPropertiesProps) {
  const [imagePreview, setImagePreview] = useState<string>(data.heroImage);

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    onUpdate({ heroImage: url });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onUpdate({ heroImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section: Hero Image */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          히어로 이미지
        </h3>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={imagePreview}
              alt="Hero preview"
              className="w-full h-full object-cover"
              onError={() => setImagePreview("")}
            />
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            이미지 업로드
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Image URL Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            또는 이미지 URL
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              link
            </span>
            <input
              type="text"
              value={data.heroImage.startsWith('data:') ? '' : data.heroImage}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Section: Text Content */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          텍스트 콘텐츠
        </h3>

        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            제목
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              title
            </span>
            <input
              type="text"
              value={data.heroTitle}
              onChange={(e) => onUpdate({ heroTitle: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              placeholder="가이드 제목을 입력하세요"
            />
          </div>
        </div>

        {/* Subtitle Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            부제목
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              subtitles
            </span>
            <input
              type="text"
              value={data.heroSubtitle}
              onChange={(e) => onUpdate({ heroSubtitle: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              placeholder="환영 메시지를 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-blue-500 text-[18px] mt-0.5">
            lightbulb
          </span>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">히어로 이미지 팁</p>
            <ul className="space-y-0.5 text-slate-500 dark:text-slate-400">
              <li>• 권장 비율: 4:3 (예: 1200x900px)</li>
              <li>• 밝고 선명한 이미지 추천</li>
              <li>• 이미지 하단에 텍스트가 표시됩니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
