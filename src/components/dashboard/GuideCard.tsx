'use client';

import { useState } from 'react';
import type { GuideCardData } from '@/types/dashboard';

interface GuideCardProps {
  guide: GuideCardData;
  onEdit?: (id: string) => void;
  onQRCode?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function GuideCard({ guide, onEdit, onQRCode, onDelete }: GuideCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\. /g, '.').replace(/\.$/, '');
    }
  };

  const getStatusBadge = () => {
    if (guide.is_published) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          발행중
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-700 shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          임시저장
        </span>
      );
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {guide.thumbnail_url && !imageError ? (
          <img
            src={guide.thumbnail_url}
            alt={guide.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700">
            <span className="material-symbols-outlined text-4xl text-slate-400">
              image
            </span>
          </div>
        )}
        {!guide.is_published && (
          <div className="absolute inset-0 bg-slate-900/10"></div>
        )}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
            {guide.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            마지막 수정: {formatDate(guide.updated_at)}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400 uppercase">
              Total Views
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {guide.is_published ? `${guide.view_count}회` : '-'}
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => onEdit?.(guide.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              title="Edit"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button
              onClick={() => onQRCode?.(guide.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              title="QR Code"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            </button>
            <button
              onClick={() => onDelete?.(guide.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-500 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              title="Delete"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
