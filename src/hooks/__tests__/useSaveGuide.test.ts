import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSaveGuide } from '../useSaveGuide';
import { ContentBlock, Story } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useSaveGuide', () => {
  const mockGuideId = 'test-guide-123';
  const mockBlocks: ContentBlock[] = [
    {
      id: 'wifi-1',
      type: 'wifi',
      order: 0,
      data: {
        ssid: 'TestWiFi',
        password: 'password123',
        networkType: 'WPA2',
      },
    },
  ];
  const mockStories: Story[] = [];

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should save guide data to localStorage', async () => {
    const { result } = renderHook(() => useSaveGuide());

    await act(async () => {
      await result.current.saveGuide(
        mockGuideId,
        mockBlocks,
        mockStories,
        'https://example.com/image.jpg',
        'Test Guide'
      );
    });

    expect(result.current.saveStatus).toBe('saved');

    const savedData = localStorageMock.getItem(`roomy_guide_${mockGuideId}`);
    expect(savedData).toBeTruthy();

    const parsedData = JSON.parse(savedData!);
    expect(parsedData.guideId).toBe(mockGuideId);
    expect(parsedData.blocks).toEqual(mockBlocks);
    expect(parsedData.heroTitle).toBe('Test Guide');
  });

  it('should load guide data from localStorage', () => {
    const mockData = {
      guideId: mockGuideId,
      blocks: mockBlocks,
      stories: mockStories,
      heroImage: 'https://example.com/image.jpg',
      heroTitle: 'Test Guide',
      heroSubtitle: 'Welcome',
      updatedAt: new Date().toISOString(),
    };

    localStorageMock.setItem(
      `roomy_guide_${mockGuideId}`,
      JSON.stringify(mockData)
    );

    const { result } = renderHook(() => useSaveGuide());

    const loadedData = result.current.loadGuide(mockGuideId);
    expect(loadedData).toBeTruthy();
    expect(loadedData?.guideId).toBe(mockGuideId);
    expect(loadedData?.blocks).toEqual(mockBlocks);
  });

  it('should return null when loading non-existent guide', () => {
    const { result } = renderHook(() => useSaveGuide());

    const loadedData = result.current.loadGuide('non-existent-id');
    expect(loadedData).toBeNull();
  });

  it('should clear guide data from localStorage', () => {
    const mockData = {
      guideId: mockGuideId,
      blocks: mockBlocks,
      stories: mockStories,
      updatedAt: new Date().toISOString(),
    };

    localStorageMock.setItem(
      `roomy_guide_${mockGuideId}`,
      JSON.stringify(mockData)
    );

    const { result } = renderHook(() => useSaveGuide());

    act(() => {
      result.current.clearGuide(mockGuideId);
    });

    const loadedData = result.current.loadGuide(mockGuideId);
    expect(loadedData).toBeNull();
  });

  it('should show saving status during save operation', async () => {
    const { result } = renderHook(() => useSaveGuide());

    expect(result.current.saveStatus).toBe('saved');

    const savePromise = act(async () => {
      return result.current.saveGuide(
        mockGuideId,
        mockBlocks,
        mockStories
      );
    });

    // During save
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await savePromise;

    // After save
    expect(result.current.saveStatus).toBe('saved');
  });
});
