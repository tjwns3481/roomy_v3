import { AIChatbot } from '@/components/guest/AIChatbot';

export default function ChatbotDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          AI 챗봇 컴포넌트 데모
        </h1>
        <p className="mb-8 text-gray-600">
          우측 하단의 플로팅 버튼을 클릭하여 챗봇을 열어보세요.
        </p>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">구현된 기능</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>플로팅 버튼으로 챗봇 열기/닫기</li>
            <li>바텀시트 형태의 채팅창</li>
            <li>사용자/AI 메시지 구분 (좌/우 정렬)</li>
            <li>타이핑 인디케이터 (AI 응답 대기 중)</li>
            <li>Enter키 전송, Shift+Enter 줄바꿈</li>
            <li>자동 스크롤</li>
            <li>Framer Motion 애니메이션</li>
          </ul>
        </div>

        <div className="mt-8 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-yellow-900">
            주의사항
          </h3>
          <p className="text-yellow-800">
            현재는 UI만 구현된 상태입니다. 실제 AI API 연동은 P5-S1-T2에서 진행됩니다.
          </p>
        </div>
      </div>

      {/* AI 챗봇 컴포넌트 */}
      <AIChatbot guideId="demo-guide-id" guideTitle="데모 가이드" />
    </div>
  );
}
