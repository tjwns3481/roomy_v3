'use client';

import { ContactBlockData } from '@/types';

interface ContactBlockProps {
  data: ContactBlockData;
}

export function ContactBlock({ data }: ContactBlockProps) {
  const hasContact = data.name || data.phone || data.email || data.kakaoId;

  if (!hasContact) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        연락처
      </h3>

      <div className="space-y-3">
        {/* Name */}
        {data.name && (
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">이름</p>
              <p className="font-medium">{data.name}</p>
            </div>
          </div>
        )}

        {/* Phone */}
        {data.phone && (
          <a
            href={`tel:${data.phone}`}
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">전화</p>
              <p className="font-medium text-green-600">{data.phone}</p>
            </div>
          </a>
        )}

        {/* Email */}
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">이메일</p>
              <p className="font-medium text-blue-600">{data.email}</p>
            </div>
          </a>
        )}

        {/* KakaoTalk */}
        {data.kakaoId && (
          <a
            href={`https://open.kakao.com/o/${data.kakaoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-yellow-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.683 1.775 5.037 4.447 6.396l-.9 3.327a.428.428 0 00.654.458l3.96-2.629c.592.078 1.198.12 1.839.12 5.523 0 10-3.463 10-7.714C22 6.463 17.523 3 12 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">카카오톡</p>
              <p className="font-medium text-yellow-600">오픈채팅</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
