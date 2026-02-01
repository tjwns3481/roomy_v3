# Editor Components

블록 에디터 3단 레이아웃 컴포넌트

## 구조

```
EditorLayout (3-column layout)
├── Sidebar (왼쪽)
│   ├── Search
│   └── BlockCategory
│       └── BlockPaletteItem (드래그 가능)
├── Canvas (중앙)
│   ├── Device Frame (모바일/데스크톱)
│   └── Block List (편집 영역)
└── PreviewPanel (오른쪽)
    ├── Block Settings
    └── Style Options
```

## 주요 컴포넌트

### EditorLayout
- 3단 레이아웃 컨테이너
- 상단 네비게이션 바
- 디바이스 모드 전환 (모바일/데스크톱)
- 자동 저장 상태 표시

### Sidebar
- 블록 팔레트
- 카테고리별 블록 (기본정보, 콘텐츠, 위치)
- 블록 검색 기능

### PreviewPanel
- 선택된 블록 속성 편집
- 스타일 설정
- 블록 복제/삭제

## 사용 예시

```tsx
import { EditorLayout } from "@/components/editor/EditorLayout";

export default function EditorPage({ params }: { params: { guideId: string } }) {
  return (
    <EditorLayout guideId={params.guideId}>
      {/* 블록 콘텐츠 */}
    </EditorLayout>
  );
}
```

## 스타일링

- TailwindCSS 사용
- Material Symbols 아이콘
- 다크 모드 지원
- 반응형 디자인 (모바일은 탭 전환 TODO)

## 새로 추가된 컴포넌트 (P3-S2-T2)

### BlockList
- 블록 목록 렌더링
- @dnd-kit 기반 드래그앤드롭 정렬
- 블록 추가/삭제/복제 관리

### BlockItem
- 개별 블록 표시
- 드래그 핸들
- 삭제/복제 버튼
- 선택 상태 표시

### AddBlockMenu
- 블록 타입 선택 모달
- 카테고리 필터 (전체/기본/콘텐츠/위치)
- 블록 템플릿 그리드

## TODO

- [x] 드래그 앤 드롭 구현
- [x] 블록 추가/삭제 로직
- [ ] 실시간 저장
- [ ] 모바일 반응형 (탭 전환)
- [ ] 프리뷰 모달
