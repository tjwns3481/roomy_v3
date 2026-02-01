'use client';

import { useState } from 'react';
import { ContentBlock, WifiBlockData } from '@/types';

interface WifiEditorProps {
  block: ContentBlock;
  onChange: (data: WifiBlockData) => void;
}

const NETWORK_TYPES = ['WPA', 'WPA2', 'WEP', 'None'] as const;

export function WifiEditor({ block, onChange }: WifiEditorProps) {
  const data = block.data as WifiBlockData;
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    field: keyof WifiBlockData,
    value: string | undefined
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-500">wifi</span>
        <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
          Wi-Fi 설정
        </h2>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          콘텐츠 입력
        </h3>

        {/* SSID Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            네트워크 이름 (SSID)
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              router
            </span>
            <input
              type="text"
              value={data.ssid || ''}
              onChange={(e) => handleChange('ssid', e.target.value)}
              placeholder="WiFi 이름을 입력하세요"
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            비밀번호
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              lock
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        {/* Network Type Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            네트워크 타입
          </label>
          <div className="grid grid-cols-4 gap-2">
            {NETWORK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('networkType', type)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  data.networkType === type
                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/30 dark:border-blue-500 dark:text-blue-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            추가 안내 (선택)
          </label>
          <textarea
            value={data.note || ''}
            onChange={(e) => handleChange('note', e.target.value)}
            placeholder="예: 5G 네트워크를 우선 사용해주세요"
            rows={3}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3 resize-none"
          />
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Preview Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          미리보기
        </h3>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-500 text-[24px]">
                wifi
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-2">
                  Wi-Fi 정보
                </h4>
                {data.ssid && (
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      네트워크 이름
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-3 py-2 rounded border border-slate-200 dark:border-slate-700">
                      {data.ssid}
                    </div>
                  </div>
                )}
                {data.password && (
                  <div className="space-y-1 mt-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      비밀번호
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 font-mono">
                      {data.password}
                    </div>
                  </div>
                )}
                {data.networkType && (
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    보안 타입: <span className="font-medium">{data.networkType}</span>
                  </div>
                )}
                {data.note && (
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded border border-blue-100 dark:border-blue-900">
                    {data.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
