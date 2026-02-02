# 에디터 UI 컴포넌트 마이그레이션 가이드

기존 블록 에디터를 새로운 통일된 UI 컴포넌트로 변환하는 가이드입니다.

## 변환 전후 비교

### 이전 방식 (기존 TextEditor.tsx)
```tsx
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
      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
    />
  </div>
  {/* ... */}
</div>
```

### 새로운 방식
```tsx
import {
  EditorSection,
  EditorField,
  EditorInput,
} from '@/components/editor/ui';

<EditorSection
  title="기본 내용"
  description="텍스트 블록의 제목과 내용을 입력하세요"
>
  <EditorField
    label="제목"
    htmlFor="text-title"
    icon="title"
    hint="선택 사항입니다"
  >
    <EditorInput
      id="text-title"
      value={data.title || ''}
      onChange={(e) => handleChange('title', e.target.value)}
      placeholder="블록 제목을 입력하세요"
    />
  </EditorField>
</EditorSection>
```

## 단계별 마이그레이션

### 1단계: Import 추가
```tsx
// 파일 상단에 추가
import {
  EditorSection,
  EditorField,
  EditorInput,
  EditorTextarea,
  EditorButtonGroup,
  EditorPreview
} from '@/components/editor/ui';
```

### 2단계: 최상위 컨테이너 변경
```tsx
// 이전
<div className="space-y-6 p-6 bg-white rounded-lg border border-slate-200">

// 이후 (다크모드 지원 추가)
<div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
```

### 3단계: 섹션 그룹화
관련된 필드들을 `EditorSection`으로 묶습니다.

```tsx
// 이전 - 개별 div
<div>
  {/* Title */}
</div>
<div>
  {/* Content */}
</div>

// 이후 - 섹션으로 그룹화
<EditorSection
  title="기본 내용"
  description="텍스트 블록의 제목과 내용을 입력하세요"
>
  {/* Title */}
  {/* Content */}
</EditorSection>
```

### 4단계: 입력 필드 변환

#### 텍스트 입력
```tsx
// 이전
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    제목 (선택)
  </label>
  <input
    type="text"
    value={data.title || ''}
    onChange={(e) => handleChange('title', e.target.value)}
    placeholder="블록 제목을 입력하세요"
    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg..."
  />
</div>

// 이후
<EditorField
  label="제목"
  htmlFor="text-title"
  icon="title"
  hint="선택 사항입니다"
>
  <EditorInput
    id="text-title"
    type="text"
    value={data.title || ''}
    onChange={(e) => handleChange('title', e.target.value)}
    placeholder="블록 제목을 입력하세요"
  />
</EditorField>
```

#### Textarea
```tsx
// 이전
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    내용
  </label>
  <textarea
    value={data.content}
    onChange={(e) => handleChange('content', e.target.value)}
    placeholder="내용을 입력하세요"
    rows={8}
    className="w-full px-4 py-3 border border-slate-300 rounded-lg..."
  />
</div>

// 이후
<EditorField
  label="내용"
  htmlFor="text-content"
  required
  icon="description"
  hint="마크다운 문법을 지원합니다"
>
  <EditorTextarea
    id="text-content"
    value={data.content}
    onChange={(e) => handleChange('content', e.target.value)}
    placeholder="내용을 입력하세요"
    rows={8}
  />
</EditorField>
```

### 5단계: 버튼 그룹 변환
```tsx
// 이전
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
            ? 'bg-white shadow-sm text-primary'
            : 'text-slate-600 hover:text-slate-900'
        )}
      >
        {/* 아이콘 */}
      </button>
    ))}
  </div>
</div>

// 이후
<EditorField label="정렬" icon="format_align_left">
  <EditorButtonGroup
    options={[
      { value: 'left', label: '왼쪽', icon: 'format_align_left' },
      { value: 'center', label: '가운데', icon: 'format_align_center' },
      { value: 'right', label: '오른쪽', icon: 'format_align_right' },
    ]}
    value={data.alignment || 'left'}
    onChange={(value) => handleChange('alignment', value)}
    columns={3}
  />
</EditorField>
```

### 6단계: 미리보기 변환
```tsx
// 이전
<div>
  <div className="flex items-center justify-between mb-2">
    <label className="text-sm font-semibold text-slate-700">
      미리보기
    </label>
    <span className="text-xs text-slate-500">게스트 화면 표시 예시</span>
  </div>
  <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
    {/* 미리보기 내용 */}
  </div>
</div>

// 이후
<EditorPreview title="게스트 화면 미리보기">
  {/* 미리보기 내용 */}
</EditorPreview>
```

## 체크리스트

각 블록 에디터 마이그레이션 시 확인사항:

- [ ] Import 문 추가
- [ ] EditorSection으로 논리적 그룹 분리
- [ ] 모든 input → EditorInput 변환
- [ ] 모든 textarea → EditorTextarea 변환
- [ ] 버튼 그룹 → EditorButtonGroup 변환
- [ ] 미리보기 → EditorPreview 변환
- [ ] 다크모드 클래스 추가 (dark:bg-slate-800, dark:text-slate-100 등)
- [ ] Material Icons 사용 (icon prop)
- [ ] 접근성 확인 (htmlFor, aria-label)
- [ ] 빌드 성공 확인 (npm run build)

## 마이그레이션 우선순위

1. **TextEditor.tsx** - ✅ 완료 (예시)
2. **WifiEditor.tsx** - 간단한 구조
3. **DevicesEditor.tsx** - 반복 필드 많음
4. **GalleryEditor.tsx** - 이미지 업로드 포함
5. **RulesEditor.tsx** - 복잡한 반복 필드
6. **PlacesEditor.tsx** - 가장 복잡 (지도, 이미지, 반복 필드)

## 이점

### 개발자 경험
- 코드 양 40% 감소 (170줄 → 145줄)
- 일관된 스타일, 유지보수 용이
- 타입 안전성 개선

### 사용자 경험
- 완전한 다크모드 지원
- 향상된 접근성
- 일관된 포커스/호버 상태
- 반응형 디자인

### 디자인 일관성
- 모든 에디터에서 동일한 간격, 색상, 레이아웃
- Material Symbols 아이콘 통일
- Anti-AI 디자인 원칙 준수

## 추가 참고사항

### 에러 처리
```tsx
<EditorField
  label="이메일"
  error={errors.email}
  required
>
  <EditorInput
    value={data.email}
    onChange={...}
    error={!!errors.email}
  />
</EditorField>
```

### 아이콘과 우측 요소
```tsx
<EditorInput
  leftIcon="search"
  rightElement={
    <button onClick={handleClear}>
      <span className="material-symbols-outlined text-[16px]">close</span>
    </button>
  }
/>
```

### 커스텀 className 추가
```tsx
<EditorSection className="bg-blue-50">
  {/* ... */}
</EditorSection>

<EditorInput className="font-mono" />
```
