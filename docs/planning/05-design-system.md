# Roomy(루미) - 디자인 시스템

> 생성일: 2026-02-01
> 버전: 1.0 (MVP)

---

## 1. 디자인 원칙

### 1.1 핵심 키워드

> **미니멀 / 깨끗 / 직관적**

### 1.2 디자인 원칙

1. **심플함 우선**: 불필요한 장식 배제
2. **정보 가독성**: 게스트가 빠르게 정보를 찾을 수 있도록
3. **일관성**: 호스트/게스트 화면 모두 통일된 디자인 언어
4. **모바일 퍼스트**: 게스트 화면은 모바일 최적화

---

## 2. 컬러 팔레트

### 2.1 메인 컬러

| 이름 | Hex | 용도 |
|------|-----|------|
| **Primary** | `#2563EB` | 주요 버튼, 강조, 링크 |
| **Primary Dark** | `#1D4ED8` | 호버 상태 |
| **Primary Light** | `#DBEAFE` | 배경 하이라이트 |

### 2.2 중성 컬러

| 이름 | Hex | 용도 |
|------|-----|------|
| **Gray 900** | `#111827` | 본문 텍스트 |
| **Gray 700** | `#374151` | 보조 텍스트 |
| **Gray 500** | `#6B7280` | 플레이스홀더, 비활성 |
| **Gray 300** | `#D1D5DB` | 테두리 |
| **Gray 100** | `#F3F4F6` | 배경 (회색) |
| **White** | `#FFFFFF` | 배경 (흰색) |

### 2.3 시맨틱 컬러

| 이름 | Hex | 용도 |
|------|-----|------|
| **Success** | `#10B981` | 성공, 완료 |
| **Warning** | `#F59E0B` | 경고, 주의 |
| **Error** | `#EF4444` | 오류, 삭제 |
| **Info** | `#3B82F6` | 정보 |

### 2.4 Tailwind 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#DBEAFE',
        },
      },
    },
  },
}
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

| 용도 | 폰트 | 대체 폰트 |
|------|------|----------|
| **한글** | Pretendard | system-ui, sans-serif |
| **영문/숫자** | Pretendard | system-ui, sans-serif |

### 3.2 폰트 크기

| 이름 | 크기 | 줄 높이 | 용도 |
|------|------|---------|------|
| **Display** | 36px | 1.2 | 대형 타이틀 |
| **H1** | 28px | 1.3 | 페이지 제목 |
| **H2** | 24px | 1.3 | 섹션 제목 |
| **H3** | 20px | 1.4 | 카드 제목 |
| **Body** | 16px | 1.5 | 본문 |
| **Small** | 14px | 1.5 | 보조 텍스트 |
| **XSmall** | 12px | 1.5 | 캡션, 레이블 |

### 3.3 폰트 웨이트

| 이름 | 값 | 용도 |
|------|-----|------|
| Regular | 400 | 본문 |
| Medium | 500 | 강조 텍스트 |
| SemiBold | 600 | 제목, 버튼 |
| Bold | 700 | 주요 강조 |

---

## 4. 간격 시스템

### 4.1 기본 단위

> **Base: 4px**

| 토큰 | 값 | 용도 |
|------|-----|------|
| `space-1` | 4px | 최소 간격 |
| `space-2` | 8px | 텍스트 간격 |
| `space-3` | 12px | 요소 내부 |
| `space-4` | 16px | 요소 간격 |
| `space-5` | 20px | 섹션 내부 |
| `space-6` | 24px | 섹션 간격 |
| `space-8` | 32px | 대형 간격 |
| `space-10` | 40px | 페이지 여백 |
| `space-12` | 48px | 대형 여백 |

---

## 5. 컴포넌트

### 5.1 버튼

#### Primary Button

```css
.btn-primary {
  background-color: #2563EB;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
}

.btn-primary:hover {
  background-color: #1D4ED8;
}
```

#### Secondary Button

```css
.btn-secondary {
  background-color: white;
  color: #2563EB;
  border: 1px solid #2563EB;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}
```

#### Ghost Button

```css
.btn-ghost {
  background-color: transparent;
  color: #374151;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-ghost:hover {
  background-color: #F3F4F6;
}
```

### 5.2 입력 필드

```css
.input {
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  width: 100%;
}

.input:focus {
  border-color: #2563EB;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input::placeholder {
  color: #6B7280;
}
```

### 5.3 카드

```css
.card {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-hover:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
```

### 5.4 메뉴 아이콘 (게스트 뷰어)

```css
.menu-icon {
  width: 80px;
  height: 80px;
  background-color: #F3F4F6;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.menu-icon svg {
  width: 32px;
  height: 32px;
  color: #374151;
}

.menu-icon span {
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}
```

### 5.5 스토리 서클

```css
.story-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(45deg, #2563EB, #7C3AED);
}

.story-circle-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
}

.story-circle-viewed {
  background: #D1D5DB;
}
```

### 5.6 플로팅 버튼 (AI 챗봇)

```css
.floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background-color: #2563EB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.floating-btn svg {
  width: 24px;
  height: 24px;
  color: white;
}
```

---

## 6. 아이콘

### 6.1 아이콘 라이브러리

> **Lucide Icons** (https://lucide.dev)

### 6.2 주요 아이콘

| 이름 | 용도 |
|------|------|
| `wifi` | Wi-Fi 메뉴 |
| `scroll-text` | 이용수칙 |
| `tv` | 기기 사용법 |
| `map-pin` | 주변 맛집/명소 |
| `message-circle` | AI 챗봇 |
| `plus` | 추가 |
| `edit` | 편집 |
| `trash` | 삭제 |
| `download` | 다운로드 |
| `qr-code` | QR 코드 |

---

## 7. 레이아웃

### 7.1 호스트 대시보드

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]                              [User] [Settings]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  대시보드                                                        │
│                                                                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                      │
│  │ 가이드 1  │ │ 가이드 2  │ │ + 새 가이드│                      │
│  │           │ │           │ │           │                      │
│  │ 통계: 50  │ │ 통계: 30  │ │           │                      │
│  └───────────┘ └───────────┘ └───────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 게스트 뷰어 (모바일)

```
┌─────────────────────────┐
│  [○] [○] [○]            │  ← 스토리 서클
├─────────────────────────┤
│                         │
│     [숙소 메인 사진]     │
│                         │
├─────────────────────────┤
│                         │
│  [Wi-Fi] [수칙]         │
│  [기기]  [맛집]         │
│                         │
├─────────────────────────┤
│                         │
│     [🤖 AI 챗봇]        │  ← 플로팅 버튼
└─────────────────────────┘
```

---

## 8. 반응형 브레이크포인트

| 이름 | 최소 너비 | 용도 |
|------|----------|------|
| **sm** | 640px | 스마트폰 가로 |
| **md** | 768px | 태블릿 |
| **lg** | 1024px | 노트북 |
| **xl** | 1280px | 데스크탑 |

---

## 9. 애니메이션

### 9.1 기본 트랜지션

```css
.transition-base {
  transition: all 0.2s ease;
}

.transition-slow {
  transition: all 0.3s ease;
}
```

### 9.2 호버 효과

```css
.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

### 9.3 로딩 스피너

```css
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #E5E7EB;
  border-top-color: #2563EB;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 10. 토스트/알림

### 10.1 성공 토스트

```css
.toast-success {
  background-color: #10B981;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}
```

### 10.2 에러 토스트

```css
.toast-error {
  background-color: #EF4444;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
}
```

---

## 11. 다크 모드 (Phase 2)

> MVP에서는 라이트 모드만 지원
> Phase 2에서 다크 모드 추가 예정
