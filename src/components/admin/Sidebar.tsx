'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    icon: '📊',
    label: '대시보드',
    href: '/admin',
    disabled: false,
  },
  {
    icon: '👥',
    label: '사용자 관리',
    href: '/admin/users',
    disabled: true,
  },
  {
    icon: '📖',
    label: '가이드 관리',
    href: '/admin/guides',
    disabled: true,
  },
  {
    icon: '⚙️',
    label: '설정',
    href: '/admin/settings',
    disabled: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      {/* Logo/Title */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Roomy Admin</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className={`${baseClasses} text-gray-500 cursor-not-allowed opacity-50`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${baseClasses} ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
}
