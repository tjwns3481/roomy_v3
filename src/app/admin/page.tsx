import StatsGrid from '@/components/admin/StatsGrid';
import ActivityTable from '@/components/admin/ActivityTable';
import SignupsChart from '@/components/admin/SignupsChart';
import GuideTypesChart from '@/components/admin/GuideTypesChart';

// Dummy data for initial implementation
const dummyStats = {
  totalUsers: 1247,
  totalGuides: 384,
  todayVisits: 2156,
  todayConversations: 487,
};

const dummyActivities = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: '가이드 발행' as const,
    description: '서울 게스트하우스 가이드 발행',
    user: 'host@example.com',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: '가입' as const,
    description: '새로운 사용자 가입',
    user: 'newuser@example.com',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: '가이드 생성' as const,
    description: '부산 숙소 가이드 생성',
    user: 'host2@example.com',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: '설정 변경' as const,
    description: '프로필 정보 업데이트',
    user: 'host@example.com',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: '로그인' as const,
    description: '관리자 로그인',
    user: 'admin@roomy.com',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    type: '가이드 발행' as const,
    description: '제주 펜션 가이드 발행',
    user: 'host3@example.com',
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    type: '가입' as const,
    description: '새로운 사용자 가입',
    user: 'guest@example.com',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-2">
          Roomy 플랫폼의 전체 현황을 확인하세요
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={dummyStats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignupsChart />
        <GuideTypesChart />
      </div>

      {/* Activity Table */}
      <ActivityTable activities={dummyActivities} />
    </div>
  );
}
