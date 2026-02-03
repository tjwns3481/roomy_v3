import { useState, useCallback, useRef } from 'react';
import { ContentBlock, Story } from '@/types';

interface SaveGuideData {
  guideId: string;
  blocks: ContentBlock[];
  stories: Story[];
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  updatedAt: string;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface UseSaveGuideReturn {
  saveStatus: SaveStatus;
  saveGuide: (guideId: string, blocks: ContentBlock[], stories: Story[], heroImage?: string, heroTitle?: string, heroSubtitle?: string) => Promise<void>;
  loadGuide: (guideId: string) => SaveGuideData | null;
  clearGuide: (guideId: string) => void;
  error: string | null;
}

const STORAGE_KEY_PREFIX = 'roomy_guide_';

export function useSaveGuide(): UseSaveGuideReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [error, setError] = useState<string | null>(null);

  // 레이스 컨디션 방지를 위한 저장 버전 추적
  const saveVersionRef = useRef(0);

  const saveGuide = useCallback(async (
    guideId: string,
    blocks: ContentBlock[],
    stories: Story[],
    heroImage?: string,
    heroTitle?: string,
    heroSubtitle?: string
  ) => {
    // 현재 저장 버전 기록
    const currentVersion = ++saveVersionRef.current;

    try {
      setSaveStatus('saving');
      setError(null);

      const data: SaveGuideData = {
        guideId,
        blocks,
        stories,
        heroImage,
        heroTitle,
        heroSubtitle,
        updatedAt: new Date().toISOString(),
      };

      // 로컬 스토리지에 저장
      const key = `${STORAGE_KEY_PREFIX}${guideId}`;
      localStorage.setItem(key, JSON.stringify(data));

      // 저장 시뮬레이션 (실제 API 호출 시간을 모방)
      await new Promise(resolve => setTimeout(resolve, 500));

      // 마지막 저장 요청만 상태 업데이트 (레이스 컨디션 방지)
      if (currentVersion === saveVersionRef.current) {
        setSaveStatus('saved');
      }
    } catch (err) {
      // 마지막 저장 요청만 에러 상태 업데이트
      if (currentVersion === saveVersionRef.current) {
        console.error('Failed to save guide:', err);
        setError(err instanceof Error ? err.message : 'Failed to save guide');
        setSaveStatus('error');
      }
      throw err;
    }
  }, []);

  const loadGuide = useCallback((guideId: string): SaveGuideData | null => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${guideId}`;
      const data = localStorage.getItem(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as SaveGuideData;
    } catch (err) {
      console.error('Failed to load guide:', err);
      setError(err instanceof Error ? err.message : 'Failed to load guide');
      return null;
    }
  }, []);

  const clearGuide = useCallback((guideId: string) => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${guideId}`;
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Failed to clear guide:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear guide');
    }
  }, []);

  return {
    saveStatus,
    saveGuide,
    loadGuide,
    clearGuide,
    error,
  };
}
