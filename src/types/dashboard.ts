export interface GuideCardData {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  view_count: number;
  updated_at: string;
  accommodation_name?: string;
  thumbnail_url?: string;
}

export interface StatsCardData {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
}

export interface DashboardStats {
  total_guides: number;
  total_views: number;
  qr_scans: number;
  avg_duration: string;
}
