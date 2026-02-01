import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Roomy</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          숙박 가이드를
          <br />
          <span className="text-blue-600">스마트하게</span> 관리하세요
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
          게스트에게 필요한 모든 정보를 한 곳에. WiFi, 이용안내, 주변 맛집까지.
          <br />
          QR 코드 하나로 완벽한 체크인 경험을 제공하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            무료로 시작하기
          </Link>
          <Link
            href="/g/demo"
            className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
          >
            데모 보기
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          왜 Roomy인가요?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📱"
            title="모바일 최적화"
            description="게스트가 스마트폰으로 쉽게 확인할 수 있는 반응형 가이드"
          />
          <FeatureCard
            icon="🤖"
            title="AI 어시스턴트"
            description="24시간 게스트 질문에 답변하는 AI 챗봇으로 호스트 부담 감소"
          />
          <FeatureCard
            icon="📊"
            title="방문 분석"
            description="가이드 조회수, AI 대화 통계로 게스트 니즈 파악"
          />
          <FeatureCard
            icon="🔗"
            title="QR 코드 공유"
            description="프린트하거나 메시지로 공유할 수 있는 커스텀 QR 코드"
          />
          <FeatureCard
            icon="✏️"
            title="블록 에디터"
            description="드래그 앤 드롭으로 쉽게 가이드 작성 및 편집"
          />
          <FeatureCard
            icon="🎨"
            title="템플릿 제공"
            description="호텔, 펜션, 에어비앤비 등 업종별 템플릿으로 빠른 시작"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <span className="font-semibold text-gray-900 dark:text-white">Roomy v3</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 Roomy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
