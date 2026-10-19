export type StickerState = 'protected' | 'reapply';

export interface ScanResult {
  id: string;
  state: StickerState;
  /** Dominant sticker color sampled from the captured frame, as #rrggbb. */
  hex: string;
  /** Relative luminance (0 = black, 255 = white) used for classification. */
  luminance: number;
  /** Classification confidence from 0 to 1. */
  confidence: number;
  capturedAt: number;
}

export const STATE_LABEL: Record<StickerState, string> = {
  protected: 'Protected',
  reapply: 'Reapply sunscreen',
};
