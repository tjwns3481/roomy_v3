interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ icon, label, value, change }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
          {change && (
            <p
              className={`text-sm mt-2 ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: {
    totalUsers: number;
    totalGuides: number;
    todayVisits: number;
    todayConversations: number;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon="👥"
        label="전체 사용자"
        value={stats.totalUsers}
        change={{ value: 12, isPositive: true }}
      />
      <StatCard
        icon="📖"
        label="가이드 수"
        value={stats.totalGuides}
        change={{ value: 8, isPositive: true }}
      />
      <StatCard
        icon="👁️"
        label="오늘 방문자"
        value={stats.todayVisits}
        change={{ value: 5, isPositive: false }}
      />
      <StatCard
        icon="🤖"
        label="오늘 AI 대화"
        value={stats.todayConversations}
        change={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
