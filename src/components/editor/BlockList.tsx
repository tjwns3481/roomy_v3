'use client';

import { useState } from 'react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ContentBlock } from '@/types';
import { BlockItem } from './BlockItem';
import { AddBlockMenu } from './AddBlockMenu';

interface BlockListProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
  onBlockSelect?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

export function BlockList({
  blocks,
  onBlocksChange,
  onBlockSelect,
  selectedBlockId,
}: BlockListProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex).map(
        (block, index) => ({
          ...block,
          order: index,
        })
      );

      onBlocksChange(reorderedBlocks);
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = blocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({
        ...block,
        order: index,
      }));
    onBlocksChange(updatedBlocks);
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = blocks.find((block) => block.id === blockId);
    if (!blockToDuplicate) return;

    const newBlock: ContentBlock = {
      ...blockToDuplicate,
      // eslint-disable-next-line react-hooks/purity -- ID generated in event handler, not during render
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: blocks.length,
    };

    onBlocksChange([...blocks, newBlock]);
  };

  const handleAddBlock = (newBlock: ContentBlock) => {
    const blockWithOrder = {
      ...newBlock,
      order: blocks.length,
    };
    onBlocksChange([...blocks, blockWithOrder]);
    setIsAddMenuOpen(false);
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.map((block) => (
              <BlockItem
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onBlockSelect?.(block.id)}
                onDelete={() => handleDeleteBlock(block.id)}
                onDuplicate={() => handleDuplicateBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-sm mb-3">
            블록이 없습니다. 새 블록을 추가해보세요.
          </p>
          <button
            onClick={() => setIsAddMenuOpen(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            + 블록 추가
          </button>
        </div>
      )}

      {blocks.length > 0 && (
        <button
          onClick={() => setIsAddMenuOpen(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          + 블록 추가
        </button>
      )}

      {isAddMenuOpen && (
        <AddBlockMenu
          onSelect={handleAddBlock}
          onClose={() => setIsAddMenuOpen(false)}
        />
      )}
    </div>
  );
}
