'use client';

import { useState, useEffect } from 'react';
import { ContentBlock, TextBlockData } from '@/types';
import { cn } from '@/lib/utils';

interface TextEditorProps {
  block: ContentBlock;
  onChange: (data: TextBlockData) => void;
}

export function TextEditor({ block, onChange }: TextEditorProps) {
  const initialData: TextBlockData = {
    ...(block.data as TextBlockData),
    title: (block.data as TextBlockData)?.title || '',
    content: (block.data as TextBlockData)?.content || '',
    alignment: (block.data as TextBlockData)?.alignment || 'left',
    fontSize: (block.data as TextBlockData)?.fontSize || 'md',
  };

  const [data, setData] = useState<TextBlockData>(initialData);

  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  const handleChange = (field: keyof TextBlockData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-slate-200">
      {/* Title Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          제목 (선택)
        </label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="블록 제목을 입력하세요"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Content Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          내용
        </label>
        <textarea
          value={data.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="내용을 입력하세요. 마크다운 문법을 지원합니다."
          rows={8}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-900 placeholder:text-slate-400 font-mono text-sm leading-relaxed"
        />
        <p className="mt-2 text-xs text-slate-500">
          **볼드**, *이탤릭*, [링크](url) 등 마크다운 문법을 사용할 수 있습니다
        </p>
      </div>

      {/* Formatting Options */}
      <div className="grid grid-cols-2 gap-4">
        {/* Text Alignment */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            정렬
          </label>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => handleChange('alignment', align)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all',
                  data.alignment === align
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {align === 'left'
                    ? 'format_align_left'
                    : align === 'center'
                      ? 'format_align_center'
                      : 'format_align_right'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            글자 크기
          </label>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {([
              { value: 'sm', label: '작게' },
              { value: 'md', label: '보통' },
              { value: 'lg', label: '크게' },
            ] as const).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('fontSize', value)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all',
                  data.fontSize === value
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">
            미리보기
          </label>
          <span className="text-xs text-slate-500">게스트 화면 표시 예시</span>
        </div>
        <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
          {data.title && (
            <h3
              className={cn(
                'font-bold mb-3 text-slate-900',
                data.fontSize === 'sm' && 'text-lg',
                data.fontSize === 'md' && 'text-xl',
                data.fontSize === 'lg' && 'text-2xl',
                data.alignment === 'center' && 'text-center',
                data.alignment === 'right' && 'text-right'
              )}
            >
              {data.title}
            </h3>
          )}
          {data.content ? (
            <div
              className={cn(
                'text-slate-700 whitespace-pre-wrap',
                data.fontSize === 'sm' && 'text-sm',
                data.fontSize === 'md' && 'text-base',
                data.fontSize === 'lg' && 'text-lg',
                data.alignment === 'center' && 'text-center',
                data.alignment === 'right' && 'text-right'
              )}
            >
              {data.content}
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">
              내용을 입력하면 여기에 표시됩니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
