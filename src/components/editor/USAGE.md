# Block CRUD 컴포넌트 사용 가이드

## 개요

P3-S2-T2에서 구현한 블록 CRUD 및 드래그앤드롭 기능 사용 방법입니다.

## 설치된 라이브러리

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^9.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

## 컴포넌트 구조

```
BlockList (컨테이너)
├── DndContext (@dnd-kit)
├── SortableContext (@dnd-kit/sortable)
│   └── BlockItem (드래그 가능 아이템)
└── AddBlockMenu (블록 추가 모달)
```

## 기본 사용법

```tsx
'use client';

import { useState } from 'react';
import { BlockList } from '@/components/editor';
import { ContentBlock } from '@/types';

export default function EditorPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  return (
    <BlockList
      blocks={blocks}
      onBlocksChange={setBlocks}
      onBlockSelect={setSelectedBlockId}
      selectedBlockId={selectedBlockId}
    />
  );
}
```

## Props

### BlockList

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `blocks` | `ContentBlock[]` | Yes | 블록 배열 |
| `onBlocksChange` | `(blocks: ContentBlock[]) => void` | Yes | 블록 변경 핸들러 |
| `onBlockSelect` | `(blockId: string) => void` | No | 블록 선택 핸들러 |
| `selectedBlockId` | `string \| null` | No | 선택된 블록 ID |

### BlockItem

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `block` | `ContentBlock` | Yes | 블록 데이터 |
| `isSelected` | `boolean` | Yes | 선택 상태 |
| `onSelect` | `() => void` | Yes | 선택 핸들러 |
| `onDelete` | `() => void` | Yes | 삭제 핸들러 |
| `onDuplicate` | `() => void` | Yes | 복제 핸들러 |

### AddBlockMenu

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSelect` | `(block: ContentBlock) => void` | Yes | 블록 선택 핸들러 |
| `onClose` | `() => void` | Yes | 모달 닫기 핸들러 |

## 지원하는 블록 타입

```typescript
type BlockType =
  | 'wifi'       // WiFi 정보
  | 'rules'      // 이용 규칙
  | 'devices'    // 기기 사용법
  | 'places'     // 주변 장소
  | 'text'       // 텍스트
  | 'gallery';   // 갤러리
```

## 드래그앤드롭 동작

1. 블록 왼쪽의 드래그 핸들(≡)을 클릭하여 드래그 시작
2. 원하는 위치로 이동
3. 드롭하면 자동으로 `order` 속성이 업데이트됨
4. `onBlocksChange` 콜백으로 새로운 블록 배열 전달

## 블록 추가

1. "블록 추가" 버튼 클릭
2. AddBlockMenu 모달 표시
3. 카테고리 필터 선택 (전체/기본/콘텐츠/위치)
4. 블록 타입 선택
5. 기본 데이터로 새 블록 생성

## 블록 삭제/복제

각 블록에 마우스 호버 시 우측에 액션 버튼 표시:
- 복제 아이콘: 동일한 블록 복사
- 삭제 아이콘: 블록 제거

## 데모 페이지

실제 동작을 확인하려면:

```bash
npm run dev
```

그 다음 브라우저에서:

```
http://localhost:3000/demo/blocks
```

## 타입 정의

```typescript
interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
  data: BlockData;
}
```

각 블록 타입별 data 구조는 `src/types/index.ts`를 참조하세요.

## 향후 개선 사항

- [ ] 블록 에디터 모달 구현 (선택된 블록 편집)
- [ ] 실시간 자동 저장
- [ ] 언두/리두 기능
- [ ] 블록 그룹화
- [ ] 커스텀 블록 템플릿
