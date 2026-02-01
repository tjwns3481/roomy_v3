# AI Chatbot Components

P5-S1-T1에서 구현된 AI 챗봇 UI 컴포넌트입니다.

## 컴포넌트 구조

### 1. AIChatbot.tsx
메인 챗봇 컨테이너 컴포넌트

**Props:**
- `guideId: string` - 가이드 ID
- `guideTitle: string` - 가이드 제목 (웰컴 메시지용)

**기능:**
- 플로팅 버튼으로 챗봇 열기/닫기
- 바텀시트 형태의 채팅창 (높이 60vh)
- 웰컴 메시지 자동 표시
- 메시지 목록 자동 스크롤
- Framer Motion 애니메이션

**사용 예시:**
```tsx
import { AIChatbot } from '@/components/guest/AIChatbot';

<AIChatbot guideId="guide-123" guideTitle="우리집 가이드" />
```

### 2. ChatMessage.tsx
개별 메시지 컴포넌트

**Props:**
- `role: 'user' | 'assistant'` - 메시지 발신자
- `content: string` - 메시지 내용
- `isTyping?: boolean` - 타이핑 인디케이터 표시 여부

**특징:**
- 사용자 메시지: 우측 정렬, 파란색 배경
- AI 메시지: 좌측 정렬, 회색 배경, 로봇 아바타
- 타이핑 인디케이터 (3개의 점 애니메이션)

### 3. ChatInput.tsx
입력 필드 컴포넌트

**Props:**
- `onSend: (message: string) => void` - 메시지 전송 핸들러
- `disabled?: boolean` - 입력 비활성화 여부

**기능:**
- Enter키로 전송
- Shift+Enter로 줄바꿈
- 자동 높이 조절 (최대 128px)
- 전송 중 비활성화

## 디자인 가이드

### 색상
- 플로팅 버튼: `bg-gradient-to-br from-purple-500 to-blue-500`
- 사용자 메시지: `bg-blue-500 text-white`
- AI 메시지: `bg-gray-100 text-gray-900`
- AI 아바타: `bg-gradient-to-br from-purple-500 to-blue-500`

### 레이아웃
- 플로팅 버튼: 우측 하단 (bottom-6 right-6), 56x56px
- 채팅창: 우측 하단, 최대 너비 28rem (max-w-md)
- 채팅창 높이: 60vh (최대 600px)

### 애니메이션
- 플로팅 버튼: scale 변환, 탭 시 축소
- 채팅창: 바텀시트 슬라이드업
- 메시지: 페이드인 + 슬라이드업
- 타이핑 인디케이터: 점 크기 애니메이션 (0.6초 주기)

## 타입 정의

`src/types/index.ts`에 추가됨:

```typescript
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}
```

## TODO (P5-S1-T2)

현재는 UI만 구현된 상태이며, 실제 AI API 연동은 다음 태스크에서 진행됩니다:

- [ ] `/api/ai/chat` 엔드포인트와 연동
- [ ] 실제 Gemini API 응답 처리
- [ ] 대화 세션 관리
- [ ] 오류 처리 개선
- [ ] 로딩 상태 개선

## 데모

데모 페이지: `/demo/chatbot`

```bash
npm run dev
# http://localhost:3000/demo/chatbot 접속
```

## 참고 사항

- 모바일 퍼스트 디자인 (max-width: 428px 기준)
- Server Component와 함께 사용 가능 (Client Component임)
- Next.js 15 App Router 호환
- TypeScript 완전 지원
