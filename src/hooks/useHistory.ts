import { useState, useCallback, useRef } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  set: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

const MAX_HISTORY_LENGTH = 50;

export function useHistory<T>(initialState: T): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // 초기 상태 추적을 위한 ref
  const initialStateRef = useRef(initialState);

  const set = useCallback((newState: T) => {
    setHistory((prev) => {
      // 동일한 상태면 무시
      if (JSON.stringify(prev.present) === JSON.stringify(newState)) {
        return prev;
      }

      const newPast = [...prev.past, prev.present];
      // 히스토리 최대 길이 제한
      if (newPast.length > MAX_HISTORY_LENGTH) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: newState,
        future: [], // 새로운 상태 설정 시 future 초기화
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const clear = useCallback(() => {
    setHistory({
      past: [],
      present: initialStateRef.current,
      future: [],
    });
  }, []);

  return {
    state: history.present,
    set,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clear,
  };
}
