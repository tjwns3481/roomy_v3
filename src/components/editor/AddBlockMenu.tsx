'use client';

import { useState, useEffect, useRef } from 'react';
import { BlockType, ContentBlock } from '@/types';
import { cn } from '@/lib/utils';

interface AddBlockMenuProps {
  onSelect: (block: ContentBlock) => void;
  onClose: () => void;
}

interface BlockTemplate {
  type: BlockType;
  icon: string;
  label: string;
  description: string;
  category: 'basic' | 'content' | 'location';
  defaultData: ContentBlock['data'];
}

const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    type: 'wifi',
    icon: '📶',
    label: 'WiFi',
    description: 'WiFi 정보 공유',
    category: 'basic',
    defaultData: {
      ssid: '',
      password: '',
      note: '',
    },
  },
  {
    type: 'rules',
    icon: '📋',
    label: '이용 규칙',
    description: '체크인/체크아웃 및 규칙',
    category: 'basic',
    defaultData: {
      checkIn: '15:00',
      checkOut: '11:00',
      items: [
        { id: 'rule-1', text: '금연', category: 'notice' as const },
        { id: 'rule-2', text: '반려동물 동반 불가', category: 'notice' as const },
        { id: 'rule-3', text: '파티 금지', category: 'notice' as const },
      ],
    },
  },
  {
    type: 'devices',
    icon: '🔌',
    label: '기기 사용법',
    description: '가전제품 사용 가이드',
    category: 'basic',
    defaultData: {
      items: [],
    },
  },
  {
    type: 'places',
    icon: '📍',
    label: '주변 장소',
    description: '추천 맛집, 카페, 관광지',
    category: 'location',
    defaultData: {
      items: [],
    },
  },
  {
    type: 'text',
    icon: '📝',
    label: '텍스트',
    description: '자유로운 텍스트 작성',
    category: 'content',
    defaultData: {
      title: '제목',
      content: '내용을 입력하세요.',
    },
  },
  {
    type: 'gallery',
    icon: '🖼️',
    label: '갤러리',
    description: '여러 이미지 갤러리',
    category: 'content',
    defaultData: {
      items: [],
    },
  },
];

export function AddBlockMenu({ onSelect, onClose }: AddBlockMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'basic' | 'content' | 'location'
  >('all');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleSelectBlock = (template: BlockTemplate) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      order: 0, // Will be set by BlockList
      data: template.defaultData,
    };
    onSelect(newBlock);
  };

  const filteredTemplates =
    selectedCategory === 'all'
      ? BLOCK_TEMPLATES
      : BLOCK_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={menuRef}
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">블록 추가</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: '전체' },
              { key: 'basic', label: '기본' },
              { key: 'content', label: '콘텐츠' },
              { key: 'location', label: '위치' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() =>
                  setSelectedCategory(
                    key as 'all' | 'basic' | 'content' | 'location'
                  )
                }
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Block Templates Grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.map((template) => (
              <button
                key={template.type}
                onClick={() => handleSelectBlock(template)}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {template.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {template.label}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">
                해당 카테고리에 블록이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
