# Places Page (주변 맛집 상세 페이지)

## 구현 파일

1. **`page.tsx`** - Server Component (데이터 로딩)
2. **`PlacesContent.tsx`** - Client Component (UI 및 인터랙션)
3. **`@/components/guest/MapView.tsx`** - 지도 컴포넌트

## 주요 기능

### 1. 카테고리 필터
- 전체 / 맛집 / 카페 / 관광 / 기타
- 가로 스크롤 칩 스타일
- 실시간 개수 표시
- 선택된 탭 하이라이트

### 2. 지도 뷰
- Google Maps Static API 사용
- 최대 10개 마커 표시
- 호스트 추천 빨간색, 일반 파란색
- API 키 없을 시 Fallback UI
- 선택된 장소 오버레이 표시

### 3. 장소 목록
- 순서 번호 + 이모지
- 호스트 추천 뱃지
- 카테고리 태그
- 별점 표시 (5점 만점)
- 주소 및 지도 앱 열기 버튼
- 클릭 시 지도와 연동

## 환경 변수

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-api-key
```

> 선택 사항: 없으면 Fallback UI 표시

## Google Maps Static API 설정

1. Google Cloud Console에서 프로젝트 생성
2. Maps Static API 활성화
3. API 키 발급 및 제한 설정
4. `.env.local`에 키 추가

## 데이터 구조

```typescript
interface PlaceItem {
  name: string;
  category: "restaurant" | "cafe" | "attraction" | "etc";
  address: string;
  mapUrl?: string;        // 지도 앱 딥링크
  rating?: number;        // 0-5
  isHostPick?: boolean;   // 호스트 추천 뱃지
}
```

## UI 특징

- **Anti-AI 디자인**: 비대칭 레이아웃, 대담한 색상 사용
- **반응형**: 모바일 퍼스트
- **Sticky 헤더**: 뒤로가기 + 제목
- **스크롤 힌트**: 카테고리 탭 가로 스크롤
- **인터랙션**: 장소 클릭 시 지도 연동 및 하이라이트

## 접근 경로

```
/g/{slug}/places
```

예: `/g/jeju-paradise/places`

## 제한사항

- 지도 마커는 최대 10개 (Google Static Maps API 제한)
- 동적 지도 SDK 없음 (향후 업그레이드 가능)
- 마커 클러스터링 미지원
