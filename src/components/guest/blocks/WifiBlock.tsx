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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        {/* WiFi Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <svg
            className="w-7 h-7 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          {/* SSID */}
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            WiFi 네트워크
          </h3>
          <p className="text-2xl font-bold text-gray-900 mb-3">
            {data.ssid}
          </p>

          {/* Password Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">비밀번호</span>
              {data.networkType && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {data.networkType}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 text-lg font-mono bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 text-gray-900">
                {data.password}
              </code>

              <button
                onClick={handleCopyPassword}
                className="flex-shrink-0 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {copied ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    복사됨
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    복사
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Note */}
          {data.note && (
            <p className="mt-3 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              {data.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
