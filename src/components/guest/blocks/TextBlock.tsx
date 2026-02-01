'use client';

import { TextBlockData } from '@/types';

interface TextBlockProps {
  data: TextBlockData;
}

export function TextBlock({ data }: TextBlockProps) {
  const getAlignmentClass = () => {
    switch (data.alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const getFontSizeClass = () => {
    switch (data.fontSize) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${getAlignmentClass()}`}>
      {data.title && (
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {data.title}
        </h3>
      )}

      <div
        className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${getFontSizeClass()}`}
      >
        {data.content}
      </div>
    </div>
  );
}
