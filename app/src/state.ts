import { useEffect, useState } from 'react';
import { seed } from './data/seed';
import type { AppState } from './types';

const KEY = 'moms-map:v1';

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    /* localStorage может быть недоступен — работаем на демо-данных */
  }
  return seed;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);
  return [state, setState] as const;
}
