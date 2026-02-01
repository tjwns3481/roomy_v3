export default function AdminLoading() {
  return (
    <div className="space-y-8 p-6">
      {/* 헤더 스켈레톤 */}
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* 통계 그리드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-10 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/* 차트 스켈레톤 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-[300px] bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* 활동 테이블 스켈레톤 */}
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
