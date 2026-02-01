'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentBlock } from '@/types';
import { cn } from '@/lib/utils';

interface BlockItemProps {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function BlockItem({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBlockIcon = (type: string) => {
    const icons: Record<string, string> = {
      wifi: '📶',
      rules: '📋',
      devices: '🔌',
      places: '📍',
      text: '📝',
      gallery: '🖼️',
      image: '🖼️',
      video: '🎥',
      map: '🗺️',
      contact: '📞',
    };
    return icons[type] || '📄';
  };

  const getBlockTitle = (block: ContentBlock): string => {
    switch (block.type) {
      case 'wifi':
        return 'WiFi 정보';
      case 'rules':
        return '이용 규칙';
      case 'devices':
        return '기기 사용법';
      case 'places':
        return '주변 장소';
      case 'text':
        return (block.data as { title?: string }).title || '텍스트 블록';
      case 'gallery':
        return '갤러리';
      case 'image':
        return '이미지';
      case 'video':
        return '동영상';
      case 'map':
        return '지도';
      case 'contact':
        return '연락처';
      default:
        return '블록';
    }
  };

  const getBlockPreview = (block: ContentBlock): string => {
    switch (block.type) {
      case 'wifi':
        return (block.data as { ssid?: string }).ssid || 'WiFi 정보';
      case 'text':
        return (
          (block.data as { content?: string }).content?.substring(0, 50) || ''
        );
      case 'devices':
        const deviceCount = (block.data as { items?: unknown[] }).items
          ?.length;
        return deviceCount ? `${deviceCount}개 기기` : '기기 없음';
      case 'places':
        const placeCount = (block.data as { items?: unknown[] }).items?.length;
        return placeCount ? `${placeCount}개 장소` : '장소 없음';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-white border rounded-lg transition-all',
        isDragging && 'opacity-50 z-50',
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
          aria-label="드래그하여 순서 변경"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>

        {/* Block Icon */}
        <span className="text-2xl" aria-hidden="true">
          {getBlockIcon(block.type)}
        </span>

        {/* Block Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-gray-900 truncate">
            {getBlockTitle(block)}
          </h3>
          {getBlockPreview(block) && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {getBlockPreview(block)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="복제"
            title="복제"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            aria-label="삭제"
            title="삭제"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
