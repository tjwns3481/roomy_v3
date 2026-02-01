export default function EditorLoading() {
  return (
    <div className="h-screen flex">
      {/* 사이드바 스켈레톤 */}
      <div className="w-80 border-r border-gray-200 bg-white p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>

      {/* 에디터 영역 스켈레톤 */}
      <div className="flex-1 p-6 animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-6 w-1/2"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-100 rounded"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}
