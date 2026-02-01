import type { StatsCardData } from '@/types/dashboard';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
}

export function StatsCard({ icon, label, value, trend }: StatsCardProps) {
  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      default:
        return 'remove';
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {label}
        </p>
        <span className="material-symbols-outlined text-primary text-xl">
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <span className={`flex items-center text-sm font-medium ${getTrendColor()}`}>
            <span className="material-symbols-outlined text-sm">
              {getTrendIcon()}
            </span>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
