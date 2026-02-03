'use client';

import { useMemo } from 'react';
import { VideoBlockData } from '@/types';

interface VideoBlockProps {
  data: VideoBlockData;
}

// YouTube URL 파싱
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Vimeo URL 파싱
function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export function VideoBlock({ data }: VideoBlockProps) {
  const videoEmbed = useMemo(() => {
    if (!data.url) return null;

    const youtubeId = getYouTubeId(data.url);
    if (youtubeId) {
      const autoplayParam = data.autoplay ? '&autoplay=1&mute=1' : '';
      return {
        type: 'youtube' as const,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0${autoplayParam}`,
      };
    }

    const vimeoId = getVimeoId(data.url);
    if (vimeoId) {
      const autoplayParam = data.autoplay ? '&autoplay=1&muted=1' : '';
      return {
        type: 'vimeo' as const,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?${autoplayParam}`,
      };
    }

    // 직접 비디오 URL (mp4 등)
    if (data.url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      return {
        type: 'direct' as const,
        embedUrl: data.url,
      };
    }

    return null;
  }, [data.url, data.autoplay]);

  if (!videoEmbed) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">동영상 URL을 입력해주세요</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="aspect-video">
        {videoEmbed.type === 'direct' ? (
          <video
            src={videoEmbed.embedUrl}
            controls
            autoPlay={data.autoplay}
            muted={data.autoplay}
            playsInline
            className="w-full h-full object-cover"
          >
            <track kind="captions" />
          </video>
        ) : (
          <iframe
            src={videoEmbed.embedUrl}
            title={data.caption || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>

      {data.caption && (
        <div className="p-4">
          <p className="text-gray-600 text-sm">{data.caption}</p>
        </div>
      )}
    </div>
  );
}
