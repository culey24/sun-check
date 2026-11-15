import type { ScanResult, StickerState } from './types';

export interface SamplePhoto {
  id: string;
  label: string;
  description: string;
  /** Public URL of the photo (rendered by scripts/generate_sample_photos.py). */
  src: string;
  /** State the analyzer should return for this photo — useful for manual checks. */
  expected: StickerState;
}

const base = import.meta.env.BASE_URL;

/**
 * Test photos of the sticker worn on the back of a hand, from fresh (unactivated)
 * to fully darkened by UV. Two of them sit close to the classification threshold.
 */
export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'fresh',
    label: 'Fresh',
    description: 'Just applied, sticker still pale yellow.',
    src: `${base}samples/sticker-fresh.jpg`,
    expected: 'protected',
  },
  {
    id: 'fading',
    label: 'Fading',
    description: 'A light tint is showing — still protected, lower confidence.',
    src: `${base}samples/sticker-fading.jpg`,
    expected: 'protected',
  },
  {
    id: 'worn-off',
    label: 'Worn off',
    description: 'Sticker has darkened past the threshold.',
    src: `${base}samples/sticker-worn-off.jpg`,
    expected: 'reapply',
  },
  {
    id: 'activated',
    label: 'Fully dark',
    description: 'Sunscreen gone, sticker fully activated by UV.',
    src: `${base}samples/sticker-activated.jpg`,
    expected: 'reapply',
  },
];

const MINUTE = 60_000;

/**
 * A realistic day at the beach, newest first: protected in the morning, sticker
 * darkens after swimming, user reapplies, then it fades again late afternoon.
 * Timestamps are relative to `now` so the history always looks recent.
 */
export function createSampleHistory(now = Date.now()): ScanResult[] {
  const entries: Array<[minutesAgo: number, StickerState, string, number, number]> = [
    [10, 'reapply', '#4f3a6b', 66, 0.95],
    [55, 'reapply', '#76628a', 104, 0.7],
    [95, 'protected', '#a88d9b', 141, 0.73],
    [150, 'protected', '#f2e3bb', 225, 0.98],
    [175, 'protected', '#f4e6bd', 229, 0.98],
    [210, 'reapply', '#54406f', 72, 0.9],
    [240, 'reapply', '#7a6690', 108, 0.68],
    [300, 'protected', '#c9b3b0', 176, 0.95],
    [360, 'protected', '#f3e5bc', 228, 0.98],
  ];

  return entries.map(([minutesAgo, state, hex, luminance, confidence], index) => ({
    id: `sample-${index}`,
    state,
    hex,
    luminance,
    confidence,
    capturedAt: now - minutesAgo * MINUTE,
  }));
}
