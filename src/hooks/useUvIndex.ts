import { useCallback, useEffect, useState } from 'react';
import {
  applyUvOverride,
  fetchUvForecast,
  loadCachedUv,
  saveCachedUv,
  UV_CACHE_MS,
  type UvForecast,
} from '../lib/uv';

export type UvStatus = 'loading' | 'ready' | 'error';

/**
 * Current UV forecast for the MVP location. Serves a fresh cache instantly, refetches
 * when it is older than 15 minutes, and refreshes every 15 minutes while mounted.
 * On a network error the last cached forecast (if any) stays visible.
 */
export function useUvIndex() {
  const [forecast, setForecast] = useState<UvForecast | null>(() => loadCachedUv());
  const [status, setStatus] = useState<UvStatus>(() => (loadCachedUv() ? 'ready' : 'loading'));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setStatus((current) => (current === 'ready' ? current : 'loading'));
    setError(null);
    try {
      const next = await fetchUvForecast(undefined, signal);
      saveCachedUv(next);
      setForecast(next);
      setStatus('ready');
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : 'Could not load the UV index.');
      setStatus((current) => (current === 'ready' ? current : 'error'));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const cached = loadCachedUv();
    if (!cached || Date.now() - cached.fetchedAt > UV_CACHE_MS) {
      void refresh(controller.signal);
    }
    const timer = window.setInterval(() => void refresh(controller.signal), UV_CACHE_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [refresh]);

  return {
    forecast: forecast ? applyUvOverride(forecast) : null,
    status,
    error,
    refresh: () => void refresh(),
  };
}
