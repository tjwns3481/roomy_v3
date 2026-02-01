'use client';

import { useState } from 'react';
import { ContentBlock, PlacesBlockData, PlaceItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface PlacesEditorProps {
  block: ContentBlock;
  onChange: (data: PlacesBlockData) => void;
}

const PLACE_CATEGORIES = [
  { value: 'restaurant', label: '맛집', icon: '🍽️' },
  { value: 'cafe', label: '카페', icon: '☕' },
  { value: 'attraction', label: '관광지', icon: '🎭' },
  { value: 'etc', label: '편의시설', icon: '🏪' },
] as const;

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export function PlacesEditor({ block, onChange }: PlacesEditorProps) {
  const data = block.data as PlacesBlockData;
  const items = data.items || [];

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddPlace = (category?: PlaceItem['category']) => {
    const newPlace: PlaceItem = {
      name: '새 장소',
      category: category || 'restaurant',
      address: '주소를 입력하세요',
      mapUrl: undefined,
      rating: undefined,
      isHostPick: false,
    };

    onChange({
      items: [...items, newPlace],
    });

    setEditingId(items.length);
  };

  const handleUpdatePlace = (index: number, updates: Partial<PlaceItem>) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );

    onChange({
      items: updatedItems,
    });
  };

  const handleDeletePlace = (index: number) => {
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

  const getCategoryIcon = (category: PlaceItem['category']) => {
    const categoryData = PLACE_CATEGORIES.find((c) => c.value === category);
    return categoryData?.icon || '📍';
  };

  const getCategoryLabel = (category: PlaceItem['category']) => {
    const categoryData = PLACE_CATEGORIES.find((c) => c.value === category);
    return categoryData?.label || category;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">주변 장소</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            추천 맛집, 카페, 관광지를 소개하세요
          </p>
        </div>
        <Button onClick={() => handleAddPlace()} size="sm" variant="primary">
          장소 추가
        </Button>
      </div>

      {/* Place List */}
      {items.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">📍</div>
          <p className="text-gray-500 text-sm">아직 등록된 장소가 없습니다</p>
          <div className="flex gap-2 justify-center mt-4">
            {PLACE_CATEGORIES.map((category) => (
              <Button
                key={category.value}
                onClick={() => handleAddPlace(category.value)}
                size="sm"
                variant="secondary"
              >
                {category.icon} {category.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((place, index) => (
            <div
              key={index}
              className={cn(
                'border rounded-lg p-4 transition-all',
                editingId === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300',
                place.isHostPick && 'ring-2 ring-yellow-200'
              )}
            >
              {/* Place Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">
                    {getCategoryIcon(place.category)}
                  </span>
                  <div className="flex-1 min-w-0">
                    {editingId === index ? (
                      <Input
                        value={place.name}
                        onChange={(e) =>
                          handleUpdatePlace(index, { name: e.target.value })
                        }
                        placeholder="장소명 (예: 제주도 해녀의 집)"
                        className="font-medium"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <h4
                          className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 flex items-center gap-2"
                          onClick={() => setEditingId(index)}
                        >
                          {place.name}
                          {place.isHostPick && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              호스트 추천
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getCategoryLabel(place.category)}
                        </p>
                      </div>
                    )}
                  </div>
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
                    onClick={() => handleDeletePlace(index)}
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

              {/* Place Content */}
              {editingId === index ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PLACE_CATEGORIES.map((category) => (
                        <button
                          key={category.value}
                          onClick={() =>
                            handleUpdatePlace(index, {
                              category: category.value,
                            })
                          }
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors',
                            place.category === category.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <span>{category.icon}</span>
                          <span className="text-xs">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      주소
                    </label>
                    <Input
                      value={place.address}
                      onChange={(e) =>
                        handleUpdatePlace(index, { address: e.target.value })
                      }
                      placeholder="서울시 강남구 테헤란로 123"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      지도 URL (선택)
                    </label>
                    <Input
                      value={place.mapUrl || ''}
                      onChange={(e) =>
                        handleUpdatePlace(index, {
                          mapUrl: e.target.value || undefined,
                        })
                      }
                      placeholder="https://naver.me/... 또는 카카오맵 링크"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      네이버 지도, 카카오맵 등의 공유 링크를 입력하세요
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        평점 (선택)
                      </label>
                      <div className="flex gap-1">
                        {RATING_OPTIONS.map((rating) => (
                          <button
                            key={rating}
                            onClick={() =>
                              handleUpdatePlace(index, {
                                rating:
                                  place.rating === rating ? undefined : rating,
                              })
                            }
                            className={cn(
                              'w-8 h-8 flex items-center justify-center rounded transition-colors',
                              place.rating && rating <= place.rating
                                ? 'text-yellow-500'
                                : 'text-gray-300 hover:text-yellow-400'
                            )}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        호스트 추천
                      </label>
                      <button
                        onClick={() =>
                          handleUpdatePlace(index, {
                            isHostPick: !place.isHostPick,
                          })
                        }
                        className={cn(
                          'w-full px-3 py-2 text-sm border rounded-lg transition-colors',
                          place.isHostPick
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {place.isHostPick ? '추천 중 ⭐' : '추천하기'}
                      </button>
                    </div>
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">{place.address}</p>
                  </div>

                  {place.rating && (
                    <div className="flex items-center gap-1">
                      {RATING_OPTIONS.map((rating) => (
                        <svg
                          key={rating}
                          className={cn(
                            'w-4 h-4',
                            rating <= place.rating!
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}

                  {place.mapUrl && (
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      지도에서 보기
                    </a>
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
            카테고리별 빠르게 추가
          </p>
          <div className="grid grid-cols-4 gap-2">
            {PLACE_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => handleAddPlace(category.value)}
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
