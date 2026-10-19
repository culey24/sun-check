/**
 * Build a synthetic frame that mimics a sticker photo, so the scan flow can be
 * demoed without a camera. Runs through the same pipeline as a real capture.
 */
export function createSampleFrame(fill: string, accent = 'rgba(255,255,255,0.15)'): string {
  const size = 480;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is not available in this browser.');
  }

  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.2, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/jpeg', 0.9);
}
