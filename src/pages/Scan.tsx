import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, Loader2, RefreshCw, Video } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import StickerGuide from '../components/StickerGuide';
import AlertBanner from '../components/AlertBanner';
import { UvChip } from '../components/UvCard';
import { useCamera } from '../hooks/useCamera';
import { captureFrame } from '../lib/capture';
import { analyzeSticker } from '../lib/analyzeSticker';
import { SAMPLE_PHOTOS, type SamplePhoto } from '../lib/sampleData';
import type { ScanResult } from '../lib/types';

export default function Scan() {
  const navigate = useNavigate();
  const { videoRef, status, error, start } = useCamera();
  const [analyzing, setAnalyzing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  // When set, the viewfinder shows this test photo instead of the live camera.
  const [sample, setSample] = useState<SamplePhoto | null>(null);

  useEffect(() => {
    void start();
  }, [start]);

  const goToResult = useCallback(
    (result: ScanResult) => {
      navigate('/result', { state: { result } });
    },
    [navigate],
  );

  const runAnalysis = useCallback(
    async (frame: string) => {
      setAnalyzing(true);
      setCaptureError(null);
      try {
        const result = await analyzeSticker(frame);
        goToResult(result);
      } catch (err) {
        setCaptureError(err instanceof Error ? err.message : 'Could not analyze the frame.');
        setAnalyzing(false);
      }
    },
    [goToResult],
  );

  const handleCapture = useCallback(() => {
    if (sample) {
      // Same pipeline as a real capture, just fed the sample photo.
      void runAnalysis(sample.src);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    try {
      void runAnalysis(captureFrame(video));
    } catch (err) {
      setCaptureError(err instanceof Error ? err.message : 'Could not capture the frame.');
    }
  }, [runAnalysis, sample, videoRef]);

  const selectSample = (photo: SamplePhoto) => {
    setCaptureError(null);
    setSample((current) => (current?.id === photo.id ? null : photo));
  };

  const ready = status === 'ready';
  const canCapture = (ready || sample !== null) && !analyzing;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Scan your sticker</h1>
        <p className="text-sm text-neutral-600">
          Fill the circle with the sticker, then tap capture.
        </p>
        <div className="mt-2">
          <UvChip />
        </div>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
        <video
          ref={videoRef}
          playsInline
          muted
          className={[
            'h-full w-full object-cover',
            ready && !sample ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
        {sample && (
          <img
            src={sample.src}
            alt={`Sample photo: ${sample.description}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <StickerGuide />

        {sample && (
          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-semibold text-white">
              <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Sample: {sample.label}
            </span>
            <button
              type="button"
              onClick={() => setSample(null)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-900 hover:bg-white"
            >
              <Video className="h-3.5 w-3.5" aria-hidden="true" />
              Live camera
            </button>
          </div>
        )}

        {!ready && !sample && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
            {status === 'error' ? (
              <>
                <p className="text-sm">{error}</p>
                <Button variant="secondary" onClick={() => void start()}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Try again
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                <p className="text-sm">Starting camera…</p>
              </>
            )}
          </div>
        )}

        {analyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900/70 text-white">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            <p className="text-sm">Analyzing sticker…</p>
          </div>
        )}
      </div>

      {captureError && (
        <AlertBanner tone="warning" title="Scan failed">
          {captureError}
        </AlertBanner>
      )}

      <Button size="lg" fullWidth onClick={handleCapture} disabled={!canCapture}>
        <Camera className="h-5 w-5" aria-hidden="true" />
        Capture
      </Button>

      <Card className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-700">Test with sample photos</p>
          <p className="text-sm text-neutral-600">
            Pick a photo of the sticker on a hand, then tap capture to run the real analysis.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SAMPLE_PHOTOS.map((photo) => {
            const selected = sample?.id === photo.id;
            return (
              <li key={photo.id}>
                <button
                  type="button"
                  onClick={() => selectSample(photo)}
                  aria-pressed={selected}
                  disabled={analyzing}
                  className={[
                    'flex w-full flex-col gap-1.5 rounded-xl p-1.5 text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    selected
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'ring-1 ring-neutral-200 hover:bg-neutral-100',
                  ].join(' ')}
                >
                  <img
                    src={photo.src}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <span className="px-1 text-sm font-semibold text-neutral-900">
                    {photo.label}
                  </span>
                  <span
                    className={[
                      'px-1 pb-0.5 text-xs',
                      photo.expected === 'reapply' ? 'text-danger' : 'text-success',
                    ].join(' ')}
                  >
                    Expect: {photo.expected === 'reapply' ? 'Reapply' : 'Protected'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
