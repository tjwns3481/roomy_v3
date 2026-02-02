# Editor UI Components

통일된 에디터 레이아웃을 위한 공통 UI 컴포넌트 모음

## 컴포넌트 목록

### 1. EditorSection
섹션 구분 및 제목/설명 표시

```tsx
import { EditorSection } from '@/components/editor/ui';

<EditorSection
  title="기본 정보"
  description="가이드의 기본 정보를 입력해주세요"
>
  {/* 내용 */}
</EditorSection>
```

### 2. EditorField
라벨 + 입력 필드 조합

```tsx
import { EditorField } from '@/components/editor/ui';

<EditorField
  label="제목"
  htmlFor="title"
  required
  icon="title"
  error={errors.title}
  hint="최대 100자"
>
  <input id="title" />
</EditorField>
```

### 3. EditorInput
스타일이 적용된 input 컴포넌트

```tsx
import { EditorInput } from '@/components/editor/ui';

<EditorInput
  leftIcon="search"
  placeholder="검색..."
  error={hasError}
  rightElement={<button>Clear</button>}
/>
```

### 4. EditorTextarea
스타일이 적용된 textarea 컴포넌트

```tsx
import { EditorTextarea } from '@/components/editor/ui';

<EditorTextarea
  rows={4}
  placeholder="설명을 입력하세요"
  error={hasError}
/>
```

### 5. EditorPreview
미리보기 섹션

```tsx
import { EditorPreview } from '@/components/editor/ui';

<EditorPreview title="게스트 화면 미리보기">
  <div>미리보기 내용</div>
</EditorPreview>
```

### 6. EditorButtonGroup
선택 버튼 그룹 (라디오 버튼 대체)

```tsx
import { EditorButtonGroup } from '@/components/editor/ui';

<EditorButtonGroup
  options={[
    { value: 'left', label: '왼쪽', icon: 'align_horizontal_left' },
    { value: 'center', label: '가운데', icon: 'align_horizontal_center' },
    { value: 'right', label: '오른쪽', icon: 'align_horizontal_right' },
  ]}
  value={alignment}
  onChange={setAlignment}
  columns={3}
/>
```

## 완전한 예시

```tsx
'use client';

import { useState } from 'react';
import {
  EditorSection,
  EditorField,
  EditorInput,
  EditorTextarea,
  EditorButtonGroup,
  EditorPreview
} from '@/components/editor/ui';

export function ExampleBlockEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [alignment, setAlignment] = useState('left');

  return (
    <div className="space-y-6">
      <EditorSection
        title="기본 설정"
        description="블록의 기본 정보를 입력하세요"
      >
        <EditorField
          label="제목"
          htmlFor="title"
          required
          icon="title"
          hint="최대 50자"
        >
          <EditorInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            leftIcon="title"
          />
        </EditorField>

        <EditorField
          label="설명"
          htmlFor="description"
          icon="description"
        >
          <EditorTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명을 입력하세요"
            rows={4}
          />
        </EditorField>
      </EditorSection>

      <EditorSection title="스타일">
        <EditorField label="정렬">
          <EditorButtonGroup
            options={[
              { value: 'left', label: '왼쪽', icon: 'align_horizontal_left' },
              { value: 'center', label: '가운데', icon: 'align_horizontal_center' },
              { value: 'right', label: '오른쪽', icon: 'align_horizontal_right' },
            ]}
            value={alignment}
            onChange={setAlignment}
            columns={3}
          />
        </EditorField>
      </EditorSection>

      <EditorPreview>
        <div className={`text-${alignment}`}>
          <h3 className="font-bold">{title || '제목 없음'}</h3>
          <p className="text-sm text-slate-600">{description || '설명 없음'}</p>
        </div>
      </EditorPreview>
    </div>
  );
}
```

## 디자인 시스템

### 색상
- 주요 텍스트: `text-slate-900 dark:text-slate-100`
- 보조 텍스트: `text-slate-600 dark:text-slate-300`
- 힌트 텍스트: `text-slate-400`
- 에러: `text-red-500`
- Primary: `bg-primary text-white`

### 스페이싱
- 섹션 간격: `space-y-6`
- 필드 간격: `space-y-3`
- 라벨-입력 간격: `space-y-1.5`

### 테두리
- 기본: `rounded-lg`
- 프리뷰: `rounded-xl`

### 포커스 상태
```css
focus:outline-none
focus:ring-2
focus:ring-primary/20
focus:border-primary
```

## Material Symbols 아이콘

모든 아이콘은 Google Material Symbols를 사용합니다.

자주 사용하는 아이콘:
- `title` - 제목
- `description` - 설명
- `image` - 이미지
- `link` - 링크
- `location_on` - 위치
- `schedule` - 시간
- `error` - 에러
- `check_circle` - 체크
- `info` - 정보
- `settings` - 설정
- `search` - 검색
- `close` - 닫기

## 접근성

모든 컴포넌트는 WCAG 2.1 AA 기준을 준수합니다:

- 모든 입력 필드에 `label` 연결 (`htmlFor` 사용)
- 키보드 탐색 지원
- 포커스 상태 명확히 표시
- 에러 메시지 시각적 + 텍스트 제공
- 색상 대비 4.5:1 이상

## 다크모드

모든 컴포넌트는 자동으로 다크모드를 지원합니다.

테일윈드의 `dark:` prefix를 사용하여 구현되었습니다.
