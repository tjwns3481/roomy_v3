'use client';

import Link from 'next/link';
import { RulesBlockData } from '@/types';

interface RulesBlockProps {
  data: RulesBlockData;
  slug: string;
}

// 아이콘 이름 정규화 (대문자 → 소문자, 잘못된 이름 → 올바른 이름)
const normalizeIconName = (icon: string | undefined): string | null => {
  if (!icon) return null;
  const lower = icon.toLowerCase();
  // 잘못된 아이콘 이름 매핑
  const iconMap: Record<string, string> = {
    'no_smoking': 'smoke_free',
    'smoking_rooms': 'smoke_free',
  };
  return iconMap[lower] || lower;
};

export function RulesBlock({ data, slug }: RulesBlockProps) {
  // Show only first 3 rules in preview
  const displayItems = data.items.slice(0, 3);
  const hasMore = data.items.length > 3;

  const getIconForCategory = (category?: string) => {
    switch (category) {
      case 'checkin':
        return 'schedule';
      case 'guide':
        return 'info';
      case 'notice':
        return 'warning';
      default:
        return 'check_circle';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">이용 규칙</h3>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
            입실 {data.checkIn}
          </div>
          <div className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
            퇴실 {data.checkOut}
          </div>
        </div>
      </div>

      {/* Rules List */}
      <ul className="space-y-3 mb-4">
        {displayItems.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="material-symbols-outlined text-xl text-primary flex-shrink-0 mt-0.5">
              {normalizeIconName(item.icon) || getIconForCategory(item.category)}
            </span>
            <span className="text-gray-700 leading-relaxed">
              {item.text}
            </span>
          </li>
        ))}
      </ul>

      {/* More Link */}
      {hasMore && (
        <Link
          href={`/g/${slug}/rules`}
          className="inline-flex items-center gap-2 text-gray-900 font-medium hover:text-gray-700 transition-colors"
        >
          <span>전체 규칙 보기</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
