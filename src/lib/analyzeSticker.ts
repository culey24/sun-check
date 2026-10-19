import type { ScanResult, StickerState } from './types';

/**
 * Below this relative luminance the sticker is considered "dark" (activated by UV),
 * meaning the sunscreen has worn off and should be reapplied.
 * TODO: tune against real photochromic sticker colors.
 */
const DARK_LUMINANCE_THRESHOLD = 120;

/** Distance from the threshold (in luminance units) that yields full confidence. */
const CONFIDENCE_SPAN = 60;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not read the captured frame.'));
    image.src = dataUrl;
  });
}

/** Average the pixels of the central square region of the image. */
function sampleCenter(image: HTMLImageElement): Rgb {
  const size = Math.min(image.naturalWidth, image.naturalHeight);
  const square = Math.max(1, Math.floor(size * 0.4));
  const sx = Math.floor((image.naturalWidth - square) / 2);
  const sy = Math.floor((image.naturalHeight - square) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = square;
  canvas.height = square;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is not available in this browser.');
  }

  ctx.drawImage(image, sx, sy, square, square, 0, 0, square, square);
  const { data } = ctx.getImageData(0, 0, square, square);

  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  return { r: r / pixels, g: g / pixels, b: b / pixels };
}

function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number) =>
    Math.round(value).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Classify a captured frame as "protected" (sticker still light) or "reapply"
 * (sticker has turned dark under UV). Heuristic MVP: works on the average color of
 * the frame's center, where the on-screen guide tells the user to place the sticker.
 */
export async function analyzeSticker(dataUrl: string): Promise<ScanResult> {
  const image = await loadImage(dataUrl);
  const rgb = sampleCenter(image);
  const lum = luminance(rgb);

  const state: StickerState = lum < DARK_LUMINANCE_THRESHOLD ? 'reapply' : 'protected';
  const distance = Math.abs(lum - DARK_LUMINANCE_THRESHOLD);
  const confidence = Math.min(0.98, 0.6 + (distance / CONFIDENCE_SPAN) * 0.38);

  return {
    id: createId(),
    state,
    hex: toHex(rgb),
    luminance: Math.round(lum),
    confidence: Number(confidence.toFixed(2)),
    capturedAt: Date.now(),
  };
}
