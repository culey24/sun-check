import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import StickerGuide from '../components/StickerGuide';
import AlertBanner from '../components/AlertBanner';
import { useCamera } from '../hooks/useCamera';
import { captureFrame } from '../lib/capture';
import { analyzeSticker } from '../lib/analyzeSticker';
import { createSampleFrame } from '../lib/sampleFrame';
import type { ScanResult } from '../lib/types';

export default function Scan() {
  const navigate = useNavigate();
  const { videoRef, status, error, start } = useCamera();
  const [analyzing, setAnalyzing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

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
    const video = videoRef.current;
    if (!video) return;
    try {
      void runAnalysis(captureFrame(video));
    } catch (err) {
      setCaptureError(err instanceof Error ? err.message : 'Could not capture the frame.');
    }
  }, [runAnalysis, videoRef]);

  const handleSample = (state: 'protected' | 'reapply') => {
    const frame = createSampleFrame(state === 'reapply' ? '#3b2f4a' : '#f6e7c1');
    void runAnalysis(frame);
  };

  const ready = status === 'ready';

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Scan your sticker</h1>
        <p className="text-sm text-neutral-600">
          Fill the circle with the sticker, then tap capture.
        </p>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
        <video
          ref={videoRef}
          playsInline
          muted
          className={[
            'h-full w-full object-cover',
            ready ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />
        <StickerGuide />

        {!ready && (
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

      <Button size="lg" fullWidth onClick={handleCapture} disabled={!ready || analyzing}>
        <Camera className="h-5 w-5" aria-hidden="true" />
        Capture
      </Button>

      <Card className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-neutral-700">No camera right now?</p>
        <p className="text-sm text-neutral-600">
          Run a demo scan using a sample sticker color.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={() => handleSample('protected')}>
            Demo: light
          </Button>
          <Button variant="secondary" fullWidth onClick={() => handleSample('reapply')}>
            Demo: dark
          </Button>
        </div>
      </Card>
    </div>
  );
}
