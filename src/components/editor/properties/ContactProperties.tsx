"use client";

import { ContentBlock } from "@/types";

interface ContactPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ContactProperties({ block, onUpdate }: ContactPropertiesProps) {
  // Contact 블록은 현재 타입 정의에 없으므로 기본 구조로 처리
  const data = block.data as {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };

  return (
    <div className="space-y-6">
      {/* Section: Contact Info */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          연락처 정보
        </h3>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            이름
          </label>
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => onUpdate({ ...data, name: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            placeholder="이름을 입력하세요"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            전화번호
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              phone
            </span>
            <input
              type="tel"
              value={data.phone || ""}
              onChange={(e) => onUpdate({ ...data, phone: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              placeholder="010-1234-5678"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            이메일
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              mail
            </span>
            <input
              type="email"
              value={data.email || ""}
              onChange={(e) => onUpdate({ ...data, email: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              placeholder="example@email.com"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            주소
          </label>
          <textarea
            value={data.address || ""}
            onChange={(e) => onUpdate({ ...data, address: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3 resize-none"
            rows={2}
            placeholder="주소를 입력하세요"
          />
        </div>
      </div>
    </div>
  );
}
