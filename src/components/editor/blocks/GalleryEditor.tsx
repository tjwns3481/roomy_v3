'use client';

import { useState, useEffect, useRef } from 'react';
import { ContentBlock, GalleryBlockData, GalleryImage } from '@/types';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GalleryEditorProps {
  block: ContentBlock;
  onChange: (data: GalleryBlockData) => void;
}

interface SortableImageProps {
  image: GalleryImage;
  onRemove: () => void;
  onCaptionChange: (caption: string) => void;
}

function SortableImage({ image, onRemove, onCaptionChange }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group bg-white border-2 border-slate-200 rounded-lg overflow-hidden transition-all',
        isDragging && 'opacity-50 z-50 border-blue-500'
      )}
    >
      {/* Image */}
      <div className="aspect-square bg-slate-100 relative">
        <img
          src={image.url}
          alt={image.caption || '갤러리 이미지'}
          className="w-full h-full object-cover"
        />

        {/* Drag Handle Overlay */}
        <div
          {...attributes}
          {...listeners}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity">
            drag_indicator
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          aria-label="이미지 삭제"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Caption Input */}
      <div className="p-2">
        <input
          type="text"
          value={image.caption || ''}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="캡션 추가 (선택)"
          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}

export function GalleryEditor({ block, onChange }: GalleryEditorProps) {
  const initialData: GalleryBlockData = {
    ...(block.data as GalleryBlockData),
    images: (block.data as GalleryBlockData)?.images || [],
    layout: (block.data as GalleryBlockData)?.layout || 'grid',
  };

  const [data, setData] = useState<GalleryBlockData>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.images.findIndex((img) => img.id === active.id);
        const newIndex = prev.images.findIndex((img) => img.id === over.id);

        const newImages = arrayMove(prev.images, oldIndex, newIndex).map(
          (img, index) => ({
            ...img,
            order: index,
          })
        );

        return { ...prev, images: newImages };
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Simulate file upload (in real app, upload to storage)
    const newImages: GalleryImage[] = Array.from(files).map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      url: URL.createObjectURL(file), // Temp URL for preview
      caption: '',
      order: data.images.length + index,
    }));

    setData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setData((prev) => ({
      ...prev,
      images: prev.images
        .filter((img) => img.id !== imageId)
        .map((img, index) => ({ ...img, order: index })),
    }));
  };

  const handleCaptionChange = (imageId: string, caption: string) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.id === imageId ? { ...img, caption } : img
      ),
    }));
  };

  const handleLayoutChange = (layout: 'grid' | 'slider') => {
    setData((prev) => ({ ...prev, layout }));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-slate-200">
      {/* Layout Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          레이아웃
        </label>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => handleLayoutChange('grid')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2',
              data.layout === 'grid'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            그리드
          </button>
          <button
            type="button"
            onClick={() => handleLayoutChange('slider')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2',
              data.layout === 'slider'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <span className="material-symbols-outlined text-[18px]">
              view_carousel
            </span>
            슬라이더
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          이미지
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500 text-3xl">
              add_photo_alternate
            </span>
            <p className="text-sm text-slate-600 group-hover:text-blue-600 font-medium">
              이미지 업로드
            </p>
            <p className="text-xs text-slate-400">
              여러 파일을 선택할 수 있습니다
            </p>
          </div>
        </button>
      </div>

      {/* Image Grid */}
      {data.images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700">
              이미지 목록 ({data.images.length}개)
            </label>
            <p className="text-xs text-slate-500">
              드래그하여 순서를 변경하세요
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.images.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 gap-4">
                {data.images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onRemove={() => handleRemoveImage(image.id)}
                    onCaptionChange={(caption) =>
                      handleCaptionChange(image.id, caption)
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Preview Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">
            미리보기
          </label>
          <span className="text-xs text-slate-500">게스트 화면 표시 예시</span>
        </div>
        <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
          {data.images.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-slate-300 text-5xl">
                photo_library
              </span>
              <p className="text-slate-400 text-sm mt-2">
                이미지를 업로드하면 여기에 표시됩니다
              </p>
            </div>
          ) : data.layout === 'grid' ? (
            <div className="grid grid-cols-2 gap-2">
              {data.images.slice(0, 4).map((image) => (
                <div
                  key={image.id}
                  className="aspect-square bg-slate-200 rounded overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.caption || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative aspect-video bg-slate-200 rounded-lg overflow-hidden">
              {data.images[0] && (
                <img
                  src={data.images[0].url}
                  alt={data.images[0].caption || ''}
                  className="w-full h-full object-cover"
                />
              )}
              {data.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {data.images.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        index === 0 ? 'bg-white' : 'bg-white/50'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
