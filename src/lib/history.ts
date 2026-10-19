import type { ScanResult } from './types';

const STORAGE_KEY = 'suncheck.history.v1';
const MAX_ENTRIES = 50;

export function loadHistory(): ScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addScan(result: ScanResult): ScanResult[] {
  const next = [result, ...loadHistory()].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures (private mode, quota) — history is best-effort.
  }
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
