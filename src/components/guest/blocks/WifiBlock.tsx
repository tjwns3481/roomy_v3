'use client';

import { useState } from 'react';
import { WifiBlockData } from '@/types';

interface WifiBlockProps {
  data: WifiBlockData;
}

export function WifiBlock({ data }: WifiBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(data.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
            wifi
          </span>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Wi-Fi</p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {data.ssid || "네트워크 이름"}
          </p>
        </div>
        {data.networkType && (
          <span className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            {data.networkType}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2.5 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">비밀번호</p>
          <code className="text-sm font-mono font-medium text-slate-900 dark:text-white select-all">
            {data.password || "비밀번호 없음"}
          </code>
        </div>
        <button
          onClick={handleCopyPassword}
          disabled={!data.password}
          className={`h-full px-4 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-slate-900 dark:bg-slate-600 text-white hover:bg-slate-800 dark:hover:bg-slate-500'
          }`}
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>

      {/* Note */}
      {data.note && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {data.note}
        </p>
      )}
    </div>
  );
}
