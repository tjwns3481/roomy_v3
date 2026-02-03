'use client';

import { useState } from 'react';
import { ContentBlock, DevicesBlockData, DeviceItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface DevicesEditorProps {
  block: ContentBlock;
  onChange: (data: DevicesBlockData) => void;
}

const DEVICE_CATEGORIES = [
  { value: 'tv', label: 'TV', icon: '📺' },
  { value: 'ac', label: '에어컨', icon: '❄️' },
  { value: 'washer', label: '세탁기', icon: '🧺' },
  { value: 'coffee', label: '커피머신', icon: '☕' },
  { value: 'kitchen', label: '주방기기', icon: '🍳' },
  { value: 'other', label: '기타', icon: '🔌' },
] as const;

export function DevicesEditor({ block, onChange }: DevicesEditorProps) {
  const data = block.data as DevicesBlockData;
  const items = data.items || [];

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddDevice = () => {
    const newDevice: DeviceItem = {
      name: '새 기기',
      description: '사용법을 입력하세요',
      imageUrl: undefined,
    };

    onChange({
      items: [...items, newDevice],
    });

    setEditingId(items.length);
  };

  const handleUpdateDevice = (index: number, updates: Partial<DeviceItem>) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );

    onChange({
      items: updatedItems,
    });
  };

  const handleDeleteDevice = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange({
      items: updatedItems,
    });

    if (editingId === index) {
      setEditingId(null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const updatedItems = [...items];
    [updatedItems[index - 1], updatedItems[index]] = [
      updatedItems[index],
      updatedItems[index - 1],
    ];

    onChange({
      items: updatedItems,
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;

    const updatedItems = [...items];
    [updatedItems[index], updatedItems[index + 1]] = [
      updatedItems[index + 1],
      updatedItems[index],
    ];

    onChange({
      items: updatedItems,
    });
  };

  const handleTitleChange = (newTitle: string) => {
    onChange({
      ...data,
      title: newTitle,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">블록 제목</h3>
          <Button onClick={handleAddDevice} size="sm" variant="primary">
            기기 추가
          </Button>
        </div>
        <Input
          value={data.title || "시설 안내"}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="블록 제목 입력 (예: 시설 안내, 가전제품 사용법)"
          className="font-medium"
        />
        <p className="text-sm text-gray-500">
          숙소 내 기기 사용 방법을 안내하세요
        </p>
      </div>

      {/* Device List */}
      {items.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">🔌</div>
          <p className="text-gray-500 text-sm">
            아직 등록된 기기가 없습니다
          </p>
          <Button
            onClick={handleAddDevice}
            size="sm"
            variant="secondary"
            className="mt-4"
          >
            첫 기기 추가하기
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((device, index) => (
            <div
              key={index}
              className={cn(
                'border rounded-lg p-4 transition-all',
                editingId === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              {/* Device Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  {editingId === index ? (
                    <Input
                      value={device.name}
                      onChange={(e) =>
                        handleUpdateDevice(index, { name: e.target.value })
                      }
                      placeholder="기기명 (예: LG 스마트 TV)"
                      className="font-medium"
                      autoFocus
                    />
                  ) : (
                    <h4
                      className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => setEditingId(index)}
                    >
                      {device.name}
                    </h4>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                    title="위로 이동"
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
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                    title="아래로 이동"
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      setEditingId(editingId === index ? null : index)
                    }
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
                    title={editingId === index ? '편집 완료' : '편집'}
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDeleteDevice(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
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

              {/* Device Content */}
              {editingId === index ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      사용법
                    </label>
                    <textarea
                      value={device.description}
                      onChange={(e) =>
                        handleUpdateDevice(index, {
                          description: e.target.value,
                        })
                      }
                      placeholder="상세한 사용 방법을 입력하세요&#10;예: 1. 리모컨의 전원 버튼을 누릅니다&#10;2. 넷플릭스 앱을 선택합니다"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      이미지 URL (선택)
                    </label>
                    <Input
                      value={device.imageUrl || ''}
                      onChange={(e) =>
                        handleUpdateDevice(index, {
                          imageUrl: e.target.value || undefined,
                        })
                      }
                      placeholder="https://example.com/device-image.jpg"
                    />
                    {device.imageUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={device.imageUrl}
                          alt={device.name}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => setEditingId(null)}
                      size="sm"
                      variant="primary"
                    >
                      완료
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {device.description}
                  </p>
                  {device.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={device.imageUrl}
                        alt={device.name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Category */}
      {items.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-xs font-medium text-gray-700 mb-2">
            자주 사용하는 기기 빠르게 추가
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEVICE_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  const newDevice: DeviceItem = {
                    name: category.label,
                    description: '사용법을 입력하세요',
                  };
                  onChange({
                    items: [...items, newDevice],
                  });
                  setEditingId(items.length);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
