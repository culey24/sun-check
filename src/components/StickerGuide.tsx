interface StickerGuideProps {
  /** Diameter of the guide circle as a percentage of the viewport's shorter side. */
  size?: number;
}

export default function StickerGuide({ size = 62 }: StickerGuideProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="rounded-full border-2 border-dashed border-white/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.35)]"
        style={{ width: `${size}%`, aspectRatio: '1 / 1' }}
      />
    </div>
  );
}
