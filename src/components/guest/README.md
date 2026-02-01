# Guest Components

## BlockRenderer Usage

```tsx
import { BlockRenderer } from '@/components/guest/BlockRenderer';
import { Guide } from '@/types';

export default function GuidePage({ guide }: { guide: Guide }) {
  return (
    <div className="space-y-4">
      {guide.content_blocks
        .sort((a, b) => a.order - b.order)
        .map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            slug={guide.slug}
          />
        ))}
    </div>
  );
}
```

## Block Components

### 1. WifiBlock
- WiFi 네트워크 정보 표시
- 비밀번호 클립보드 복사 기능
- 네트워크 타입 뱃지

### 2. RulesBlock
- 체크인/체크아웃 시간 표시
- 규칙 목록 (최대 3개 미리보기)
- "전체 규칙 보기" 링크 → `/g/[slug]/rules`

### 3. DevicesBlock
- 아코디언 스타일 가전제품 목록
- 이미지 + 이름 + 사용법
- 클릭하여 펼치기/접기

### 4. PlacesBlock
- 주변 장소 카드 (최대 3개 미리보기)
- 카테고리별 아이콘 및 색상
- 호스트 추천 뱃지
- 평점 표시
- "전체 장소 보기" 링크 → `/g/[slug]/places`

### 5. TextBlock
- 제목 + 본문
- 정렬 옵션 (left/center/right)
- 폰트 크기 옵션 (sm/md/lg)

### 6. GalleryBlock
- Grid 레이아웃: 2열 그리드
- Slider 레이아웃: 가로 스크롤
- 라이트박스 기능 (클릭 시 확대)
- 키보드 네비게이션 (←/→/ESC)

## Bottom Sheets

### WifiBottomsheet
Wifi 정보를 표시하는 바텀시트 컴포넌트

**Props:**
```typescript
interface WifiBottomsheetProps {
  isOpen: boolean;
  onClose: () => void;
  ssid: string;
  password: string;
  networkType?: "WPA" | "WPA2" | "WEP" | "None";
}
```

**Features:**
- 드래그하여 닫기 (100px threshold)
- SSID 및 비밀번호 복사 기능
- 네트워크 타입 뱃지
- QR 코드 연결 버튼
- Framer Motion 애니메이션

**Usage:**
```tsx
const [isWifiOpen, setWifiOpen] = useState(false);

<WifiBottomsheet
  isOpen={isWifiOpen}
  onClose={() => setWifiOpen(false)}
  ssid="MyHome-5G"
  password="12345678"
  networkType="WPA2"
/>
```

### QuickActionsSheet
빠른 액션 메뉴를 표시하는 바텀시트 컴포넌트

**Props:**
```typescript
interface QuickActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  guideTitle: string;
}
```

**Actions:**
- 📞 호스트 연락
- 📍 주변 맛집 (→ `/g/[slug]#nearby`)
- 📋 이용안내 (→ `/g/[slug]#guide`)
- 💬 AI 도우미 (Phase 5, 비활성화)
- 📤 공유하기 (Web Share API + Fallback)

**Features:**
- 드래그하여 닫기
- 3열 그리드 레이아웃
- Staggered 애니메이션
- 네이티브 공유 기능 지원

**Usage:**
```tsx
const [isActionsOpen, setActionsOpen] = useState(false);

<QuickActionsSheet
  isOpen={isActionsOpen}
  onClose={() => setActionsOpen(false)}
  slug={guide.slug}
  guideTitle={guide.title}
/>
```

## Features

- 모바일 퍼스트 디자인
- 읽기 전용 (편집 불가)
- TailwindCSS 스타일링
- TypeScript 타입 안전성
- 반응형 레이아웃
- Framer Motion 애니메이션
