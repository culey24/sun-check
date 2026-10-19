import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Trash2 } from 'lucide-react';
import { buttonClasses } from '../components/Button';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { clearHistory, loadHistory } from '../lib/history';
import type { ScanResult } from '../lib/types';

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function History() {
  const [entries, setEntries] = useState<ScanResult[]>(() => loadHistory());

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">History</h1>
          <p className="text-sm text-neutral-600">
            {entries.length === 0
              ? 'Your past scans will appear here.'
              : `${entries.length} scan${entries.length === 1 ? '' : 's'} stored on this device.`}
          </p>
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-200 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-neutral-600">No scans yet.</p>
          <Link to="/scan" className={buttonClasses('primary', 'md')}>
            <Camera className="h-4 w-4" aria-hidden="true" />
            Scan a sticker
          </Link>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Card className="flex items-center gap-3">
                <span
                  className="h-10 w-10 shrink-0 rounded-full ring-1 ring-neutral-200"
                  style={{ backgroundColor: entry.hex }}
                  aria-hidden="true"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <StatusBadge state={entry.state} />
                  <span className="text-xs text-neutral-500">
                    {formatDateTime(entry.capturedAt)}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {Math.round(entry.confidence * 100)}%
                </span>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
