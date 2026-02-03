'use client';

import { useState } from 'react';
import { ContentBlock, RulesBlockData, RuleItem } from '@/types';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface RulesEditorProps {
  block: ContentBlock;
  onChange: (data: RulesBlockData) => void;
}

const RULE_ICONS = [
  'check_circle',
  'cancel',
  'warning',
  'info',
  'schedule',
  'pets',
  'smoke_free',
  'volume_off',
  'cleaning_services',
  'local_parking',
  'child_care',
  'restaurant',
];

const CATEGORIES = [
  { value: 'checkin', label: '체크인/아웃', icon: 'schedule' },
  { value: 'guide', label: '이용안내', icon: 'info' },
  { value: 'notice', label: '주의사항', icon: 'warning' },
] as const;

export function RulesEditor({ block, onChange }: RulesEditorProps) {
  const data = block.data as RulesBlockData;
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleChange = (field: keyof RulesBlockData, value: RulesBlockData[keyof RulesBlockData]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddRule = () => {
    const newRule: RuleItem = {
      id: `rule-${Date.now()}`,
      text: '',
      icon: 'check_circle',
      category: 'guide',
    };
    handleChange('items', [...(data.items || []), newRule]);
    setEditingId(newRule.id);
  };

  const handleUpdateRule = (id: string, updates: Partial<RuleItem>) => {
    const updatedItems = data.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    handleChange('items', updatedItems);
  };

  const handleDeleteRule = (id: string) => {
    const updatedItems = data.items.filter((item) => item.id !== id);
    handleChange('items', updatedItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.items.findIndex((item) => item.id === active.id);
      const newIndex = data.items.findIndex((item) => item.id === over.id);
      const reorderedItems = arrayMove(data.items, oldIndex, newIndex);
      handleChange('items', reorderedItems);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-500">gavel</span>
        <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
          이용 규칙 설정
        </h2>
      </div>

      {/* Check-in / Check-out Times */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          체크인/아웃 시간
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              체크인
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
                login
              </span>
              <input
                type="time"
                value={data.checkIn || ''}
                onChange={(e) => handleChange('checkIn', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              체크아웃
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
                logout
              </span>
              <input
                type="time"
                value={data.checkOut || ''}
                onChange={(e) => handleChange('checkOut', e.target.value)}
                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Rules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            규칙 목록
          </h3>
          <button
            type="button"
            onClick={handleAddRule}
            className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            규칙 추가
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.items?.map((item) => item.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {data.items?.map((item) => (
                <RuleItemEditor
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  onStartEdit={() => setEditingId(item.id)}
                  onEndEdit={() => setEditingId(null)}
                  onUpdate={handleUpdateRule}
                  onDelete={handleDeleteRule}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {(!data.items || data.items.length === 0) && (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
            <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">
              rule
            </span>
            <p>규칙을 추가하여 가이드를 완성하세요</p>
          </div>
        )}
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Preview */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          미리보기
        </h3>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-500 text-[24px]">
                gavel
              </span>
              <h4 className="font-semibold text-sm text-slate-800 dark:text-white">
                이용 규칙
              </h4>
            </div>

            {(data.checkIn || data.checkOut) && (
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                {data.checkIn && (
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      체크인
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white">
                      {data.checkIn}
                    </div>
                  </div>
                )}
                {data.checkOut && (
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      체크아웃
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white">
                      {data.checkOut}
                    </div>
                  </div>
                )}
              </div>
            )}

            {data.items && data.items.length > 0 && (
              <div className="space-y-2">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="material-symbols-outlined text-[20px] text-blue-500 shrink-0">
                      {item.icon || 'check_circle'}
                    </span>
                    <span className="flex-1">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface RuleItemEditorProps {
  item: RuleItem;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onUpdate: (id: string, updates: Partial<RuleItem>) => void;
  onDelete: (id: string) => void;
}

function RuleItemEditor({
  item,
  isEditing,
  onStartEdit,
  onEndEdit,
  onUpdate,
  onDelete,
}: RuleItemEditorProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white dark:bg-slate-800 border rounded-lg transition-all',
        isDragging && 'opacity-50 z-50',
        isEditing
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
          : 'border-slate-200 dark:border-slate-700'
      )}
    >
      <div className="flex items-center gap-2 p-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 touch-none"
          aria-label="드래그하여 순서 변경"
        >
          <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
        </button>

        {/* Icon Selector */}
        <div className="relative group">
          <button
            type="button"
            onClick={onStartEdit}
            className="size-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon || 'check_circle'}
            </span>
          </button>
          {isEditing && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 z-10">
              {RULE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    onUpdate(item.id, { icon });
                    onEndEdit();
                  }}
                  className={cn(
                    'size-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
                    item.icon === icon && 'bg-blue-50 dark:bg-blue-950/30 text-blue-500'
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={item.text}
          onChange={(e) => onUpdate(item.id, { text: e.target.value })}
          onFocus={onStartEdit}
          onBlur={onEndEdit}
          placeholder="규칙을 입력하세요"
          className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-800 dark:text-white placeholder-slate-400"
        />

        {/* Category Selector */}
        <select
          value={item.category || 'guide'}
          onChange={(e) =>
            onUpdate(item.id, {
              category: e.target.value as RuleItem['category'],
            })
          }
          className="text-xs bg-slate-100 dark:bg-slate-700 border-none rounded px-2 py-1 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label="삭제"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  );
}
