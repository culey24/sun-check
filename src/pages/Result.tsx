import { useEffect, useRef } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Camera, History as HistoryIcon, Sun } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import { buttonClasses } from '../components/Button';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { addScan } from '../lib/history';
import type { ScanResult } from '../lib/types';

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Result() {
  const location = useLocation();
  const result = (location.state as { result?: ScanResult } | null)?.result;
  const recordedRef = useRef(false);

  useEffect(() => {
    if (result && !recordedRef.current) {
      recordedRef.current = true;
      addScan(result);
    }
  }, [result]);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const isReapply = result.state === 'reapply';
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Scan result</h1>
        <p className="text-sm text-neutral-600">Captured at {formatTime(result.capturedAt)}</p>
      </div>

      {isReapply ? (
        <AlertBanner tone="danger" title="Reapply your sunscreen now">
          The sticker turned dark, so UV is reaching your skin. Reapply sunscreen to stay
          protected.
        </AlertBanner>
      ) : (
        <AlertBanner tone="success" title="You're protected">
          The sticker is still light — your sunscreen is blocking UV. Keep it up.
        </AlertBanner>
      )}

      <Card className="flex items-center gap-4">
        <span
          className="h-16 w-16 shrink-0 rounded-full ring-1 ring-neutral-200"
          style={{ backgroundColor: result.hex }}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-2">
          <StatusBadge state={result.state} />
          <p className="text-sm text-neutral-600">
            Sampled color <span className="font-mono">{result.hex}</span>
          </p>
          <p className="text-sm text-neutral-600">Confidence {confidencePercent}%</p>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
          <Sun className="h-4 w-4 text-warning" aria-hidden="true" />
          What to do next
        </p>
        <Card className="text-sm text-neutral-700">
          {isReapply
            ? 'Apply a generous, even layer of sunscreen and let it dry. Re-scan afterwards to confirm the sticker stays light.'
            : 'Re-scan whenever you have been in the sun for a while, or after swimming and sweating.'}
        </Card>
      </div>

      <div className="flex gap-3">
        <Link to="/scan" className={buttonClasses('primary', 'lg', true)}>
          <Camera className="h-5 w-5" aria-hidden="true" />
          Scan again
        </Link>
        <Link to="/history" className={buttonClasses('secondary', 'lg', true)}>
          <HistoryIcon className="h-5 w-5" aria-hidden="true" />
          History
        </Link>
      </div>
    </div>
  );
}
