export default function GuestPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
        </div>

        {/* 스토리 버블 스켈레톤 */}
        <div className="flex gap-3 overflow-x-auto py-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>

        {/* 콘텐츠 블록 스켈레톤 */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-40 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>

        {/* WiFi 정보 스켈레톤 */}
        <div className="bg-blue-50 rounded-xl p-4 animate-pulse">
          <div className="h-5 bg-blue-200 rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-blue-100 rounded"></div>
            <div className="h-4 bg-blue-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
