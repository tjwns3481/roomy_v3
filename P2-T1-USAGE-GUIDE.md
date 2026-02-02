# P2-T1 Usage Guide

## PhonePreview Drag-and-Drop Feature

### Quick Start

#### Basic Usage
```tsx
import { PhonePreview } from "@/components/editor/PhonePreview";

function MyEditor() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const handleReorder = (reorderedBlocks: ContentBlock[]) => {
    setBlocks(reorderedBlocks);
  };

  return (
    <PhonePreview
      blocks={blocks}
      onBlocksReorder={handleReorder}
    />
  );
}
```

---

## User Interactions

### 1. Drag with Mouse

**Step 1:** Hover over block
```
┌─────────────────────────────┐
│  [⋮⋮]  Block Content        │  ← Drag handle appears
└─────────────────────────────┘
```

**Step 2:** Click and hold drag handle
```
Cursor: grab → grabbing
Block: 100% → 50% opacity
```

**Step 3:** Move to desired position
```
Overlay: Floating preview
Blocks: Smooth repositioning
```

**Step 4:** Release to drop
```
Order: Recalculated (0, 1, 2...)
Auto-save: Triggered
```

---

### 2. Drag with Keyboard

**Step 1:** Tab to block
```
Focus ring visible
```

**Step 2:** Press Space
```
Block: Picked up
Announced: "Block selected for dragging"
```

**Step 3:** Arrow keys to move
```
↑ / ↓ : Move up/down
Announced: "Block moved to position N"
```

**Step 4:** Press Space to drop
```
Block: Dropped
Announced: "Block dropped"
```

**Step 5:** Press Escape to cancel
```
Block: Returns to original position
```

---

### 3. Touch on Mobile

**Step 1:** Long press block (500ms)
```
Haptic feedback
Drag handle appears
```

**Step 2:** Drag finger
```
Block follows touch point
Other blocks reposition
```

**Step 3:** Release finger
```
Block drops at position
Auto-save triggered
```

---

## Code Examples

### Example 1: Basic Integration

```tsx
"use client";

import { useState } from "react";
import { PhonePreview } from "@/components/editor/PhonePreview";
import type { ContentBlock } from "@/types";

export function SimpleEditor() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: "1", type: "text", order: 0, data: { content: "Hello" } },
    { id: "2", type: "image", order: 1, data: { url: "/img.jpg" } },
  ]);

  return (
    <PhonePreview
      blocks={blocks}
      title="My Guide"
      deviceMode="mobile"
      onBlocksReorder={setBlocks}
    />
  );
}
```

---

### Example 2: With Selection

```tsx
export function EditorWithSelection() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([...]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <PhonePreview
      blocks={blocks}
      selectedBlockId={selectedId}
      onBlockSelect={setSelectedId}
      onBlocksReorder={setBlocks}
    />
  );
}
```

---

### Example 3: With Auto-save

```tsx
export function EditorWithAutoSave() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([...]);

  const { status } = useAutoSave({
    guideId: "guide-123",
    data: { content_blocks: blocks },
    debounceMs: 2000,
  });

  const handleReorder = (reorderedBlocks: ContentBlock[]) => {
    setBlocks(reorderedBlocks);
    // useAutoSave automatically detects change
  };

  return (
    <>
      <SaveStatus status={status} />
      <PhonePreview
        blocks={blocks}
        onBlocksReorder={handleReorder}
      />
    </>
  );
}
```

---

### Example 4: With Undo/Redo

```tsx
export function EditorWithHistory() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([...]);
  const [history, setHistory] = useState<ContentBlock[][]>([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleReorder = (reorderedBlocks: ContentBlock[]) => {
    setBlocks(reorderedBlocks);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(reorderedBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  return (
    <>
      <button onClick={undo} disabled={historyIndex === 0}>
        Undo
      </button>
      <button onClick={redo} disabled={historyIndex === history.length - 1}>
        Redo
      </button>
      <PhonePreview
        blocks={blocks}
        onBlocksReorder={handleReorder}
      />
    </>
  );
}
```

---

## Best Practices

### 1. State Management

**DO:** Keep blocks in parent state
```tsx
const [blocks, setBlocks] = useState<ContentBlock[]>([]);
```

**DON'T:** Mutate blocks directly
```tsx
// ❌ Bad
blocks[0].order = 1;

// ✅ Good
setBlocks(blocks.map((b, i) => ({ ...b, order: i })));
```

---

### 2. Performance

**DO:** Use unique, stable IDs
```tsx
const newBlock = {
  id: `block-${Date.now()}-${crypto.randomUUID()}`,
  // ...
};
```

**DON'T:** Use array indices as keys
```tsx
// ❌ Bad
{blocks.map((block, index) => <Block key={index} />)}

// ✅ Good
{blocks.map((block) => <Block key={block.id} />)}
```

---

### 3. Error Handling

**DO:** Validate reordered blocks
```tsx
const handleReorder = (reorderedBlocks: ContentBlock[]) => {
  if (reorderedBlocks.length !== blocks.length) {
    console.error("Block count mismatch");
    return;
  }
  setBlocks(reorderedBlocks);
};
```

**DO:** Handle async save errors
```tsx
const handleReorder = async (reorderedBlocks: ContentBlock[]) => {
  const prevBlocks = blocks;
  setBlocks(reorderedBlocks);

  try {
    await saveBlocks(reorderedBlocks);
  } catch (error) {
    // Rollback on error
    setBlocks(prevBlocks);
    toast.error("Failed to save order");
  }
};
```

---

### 4. Accessibility

**DO:** Provide keyboard shortcuts
```tsx
useHotkeys("mod+z", undo);
useHotkeys("mod+shift+z", redo);
```

**DO:** Announce changes to screen readers
```tsx
const announceReorder = (block: ContentBlock, newIndex: number) => {
  const message = `Block moved to position ${newIndex + 1}`;
  announce(message);
};
```

---

## Common Patterns

### Pattern 1: Optimistic Updates

```tsx
const handleReorder = async (reorderedBlocks: ContentBlock[]) => {
  // Update UI immediately
  setBlocks(reorderedBlocks);

  // Save in background
  try {
    await api.updateGuide(guideId, { blocks: reorderedBlocks });
  } catch (error) {
    // Revert on error
    setBlocks(blocks);
  }
};
```

---

### Pattern 2: Batch Updates

```tsx
const handleReorder = (reorderedBlocks: ContentBlock[]) => {
  // Queue update
  updateQueue.add(() => setBlocks(reorderedBlocks));

  // Batch process after 1 second
  debounce(() => {
    updateQueue.flush();
  }, 1000);
};
```

---

### Pattern 3: Conditional Reordering

```tsx
const handleReorder = (reorderedBlocks: ContentBlock[]) => {
  // Only allow if conditions met
  if (userRole !== "admin" && isPublished) {
    toast.error("Cannot reorder published guide");
    return;
  }

  setBlocks(reorderedBlocks);
};
```

---

## Troubleshooting

### Issue 1: Drag Handle Not Appearing

**Symptom:** Drag handle never shows on hover

**Solution:** Check parent container overflow
```tsx
// ❌ Bad
<div className="overflow-hidden">
  <PhonePreview ... />
</div>

// ✅ Good
<div className="overflow-visible">
  <PhonePreview ... />
</div>
```

---

### Issue 2: Janky Animations

**Symptom:** Choppy movement during drag

**Solution:** Enable GPU acceleration
```tsx
// Add to parent container
<div style={{ willChange: "transform" }}>
  <PhonePreview ... />
</div>
```

---

### Issue 3: Touch Not Working

**Symptom:** Touch drag doesn't work on mobile

**Solution:** Check touch-action CSS
```css
/* Add to global CSS */
.sortable-item {
  touch-action: none;
}
```

---

### Issue 4: Order Values Out of Sync

**Symptom:** Block order doesn't match visual order

**Solution:** Always recalculate order on reorder
```tsx
const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex).map(
  (block, index) => ({ ...block, order: index })
);
```

---

## Styling Customization

### Custom Drag Handle

```tsx
// Override in PhonePreview.tsx
<div className="custom-drag-handle">
  <YourCustomIcon />
</div>
```

---

### Custom Selection Style

```tsx
// Override in PhonePreview.tsx
<div className={cn(
  isSelected && "ring-4 ring-purple-500"  // Custom style
)}>
```

---

### Custom Drag Overlay

```tsx
<DragOverlay>
  {activeBlock && (
    <div className="custom-overlay-style">
      <BlockRenderer block={activeBlock} />
    </div>
  )}
</DragOverlay>
```

---

## Testing

### Unit Test Example

```tsx
import { render, screen } from "@testing-library/react";
import { PhonePreview } from "./PhonePreview";

test("reorders blocks on drag", () => {
  const blocks = [
    { id: "1", type: "text", order: 0, data: {} },
    { id: "2", type: "text", order: 1, data: {} },
  ];

  const handleReorder = jest.fn();

  render(
    <PhonePreview
      blocks={blocks}
      onBlocksReorder={handleReorder}
    />
  );

  // Simulate drag
  // ...

  expect(handleReorder).toHaveBeenCalledWith([
    { id: "2", type: "text", order: 0, data: {} },
    { id: "1", type: "text", order: 1, data: {} },
  ]);
});
```

---

### E2E Test Example

```tsx
// e2e/drag-and-drop.spec.ts
import { test, expect } from "@playwright/test";

test("drag block to reorder", async ({ page }) => {
  await page.goto("/editor/guide-123");

  const firstBlock = page.locator("[data-block-id='1']");
  const secondBlock = page.locator("[data-block-id='2']");

  // Drag first block to second position
  await firstBlock.hover();
  await page.locator(".drag-handle").first().click();
  await firstBlock.dragTo(secondBlock);

  // Verify order changed
  const blocks = await page.locator("[data-block]").all();
  expect(await blocks[0].getAttribute("data-block-id")).toBe("2");
  expect(await blocks[1].getAttribute("data-block-id")).toBe("1");
});
```

---

## FAQs

### Q: How do I disable drag-and-drop?

**A:** Don't pass `onBlocksReorder` prop
```tsx
<PhonePreview
  blocks={blocks}
  // No onBlocksReorder = no drag-and-drop
/>
```

---

### Q: Can I drag between multiple PhonePreviews?

**A:** Not currently supported. Each PhonePreview has its own DndContext.

---

### Q: How do I animate new blocks?

**A:** Use Framer Motion
```tsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <SortableBlockCard ... />
</motion.div>
```

---

### Q: How do I persist order to database?

**A:** Use `useAutoSave` hook (already integrated in EditorLayout)

---

### Q: Can I customize the activation distance?

**A:** Yes, modify PointerSensor config
```tsx
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 16,  // Change from 8 to 16
  },
})
```

---

## Related Documentation

- [PhonePreview API Reference](./components/editor/PhonePreview.tsx)
- [EditorLayout Integration](./components/editor/EditorLayout.tsx)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [ContentBlock Types](./types/index.ts)

---

**Last Updated:** 2026-02-02
**Version:** 1.0.0
**Maintainer:** Roomy v3 Team
