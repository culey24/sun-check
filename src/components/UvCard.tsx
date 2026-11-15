import { Loader2, MapPin, RefreshCw, Sun } from 'lucide-react';
import AlertBanner from './AlertBanner';
import Card from './Card';
import { useUvIndex } from '../hooks/useUvIndex';
import { formatHour, uvLevel, UV_WARNING_THRESHOLD, type UvForecast } from '../lib/uv';

/** Daylight hours shown in the hourly chart. */
const FIRST_HOUR = 6;
const LAST_HOUR = 18;
/** Bars are scaled against at least this UV so a low day doesn't look alarming. */
const CHART_MIN_SCALE = 11;

function HourlyChart({ forecast }: { forecast: UvForecast }) {
  const hours = forecast.hourly.filter((h) => h.hour >= FIRST_HOUR && h.hour <= LAST_HOUR);
  const scale = Math.max(CHART_MIN_SCALE, ...hours.map((h) => h.uv));

  return (
    <figure className="flex flex-col gap-1.5">
      <div
        className="flex h-20 items-end gap-1"
        role="img"
        aria-label={`Hourly UV index today, peaking at ${forecast.todayMax.toFixed(1)} around ${formatHour(forecast.peakHour)}`}
      >
        {hours.map(({ hour, uv }) => {
          const isNow = hour === forecast.currentHour;
          return (
            <div key={hour} className="flex h-full flex-1 flex-col justify-end">
              <div
                className={[
                  'w-full rounded-t-sm',
                  isNow ? 'ring-2 ring-neutral-900 ring-offset-1' : 'opacity-80',
                ].join(' ')}
                style={{
                  height: `${Math.max(3, (uv / scale) * 100)}%`,
                  backgroundColor: uvLevel(uv).color,
                }}
                title={`${formatHour(hour)} — UV ${uv.toFixed(1)}`}
              />
            </div>
          );
        })}
      </div>
      <figcaption className="flex justify-between text-[11px] text-neutral-500">
        <span>{formatHour(FIRST_HOUR)}</span>
        <span>12:00</span>
        <span>{formatHour(LAST_HOUR)}</span>
      </figcaption>
    </figure>
  );
}

function UvWarning({ forecast }: { forecast: UvForecast }) {
  const level = uvLevel(forecast.current);

  if (!forecast.isDay) {
    return null;
  }
  if (Math.round(forecast.current) >= UV_WARNING_THRESHOLD) {
    return (
      <AlertBanner tone="danger" title={`${level.label} UV in ${forecast.location.name} right now`}>
        Check your sticker every {level.checkEveryMinutes} minutes while you are outside.
      </AlertBanner>
    );
  }
  // Still low now, but the day is heading into high UV.
  const upcoming = forecast.hourly.find(
    (h) => h.hour > forecast.currentHour && Math.round(h.uv) >= UV_WARNING_THRESHOLD,
  );
  if (upcoming) {
    return (
      <AlertBanner tone="warning" title={`UV turns ${uvLevel(upcoming.uv).label.toLowerCase()} from ${formatHour(upcoming.hour)}`}>
        Put sunscreen on before heading out and scan your sticker during the day.
      </AlertBanner>
    );
  }
  return null;
}

export default function UvCard() {
  const { forecast, status, error, refresh } = useUvIndex();

  if (!forecast) {
    return (
      <Card className="flex items-center gap-3 text-sm text-neutral-600">
        {status === 'error' ? (
          <>
            <span className="flex-1">{error ?? 'Could not load the UV index.'}</span>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-primary hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          </>
        ) : (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading today's UV index…
          </>
        )}
      </Card>
    );
  }

  const level = uvLevel(forecast.current);
  const peakLevel = uvLevel(forecast.todayMax);

  return (
    <section className="flex flex-col gap-3" aria-labelledby="uv-heading">
      <UvWarning forecast={forecast} />

      <Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="uv-heading" className="flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
              <Sun className="h-4 w-4 text-warning" aria-hidden="true" />
              UV index now
            </h2>
            <p className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {forecast.location.name} · {forecast.observedAt}
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh UV index"
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white"
            style={{ backgroundColor: level.color }}
          >
            {Math.round(forecast.current)}
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{forecast.isDay ? level.label : 'Sun is down'}</p>
            <p className="text-sm text-neutral-600">
              {forecast.isDay ? level.advice : 'No UV right now. Remove your sticker or keep it for tomorrow.'}
            </p>
          </div>
        </div>

        <HourlyChart forecast={forecast} />

        <p className="text-sm text-neutral-600">
          Today's peak:{' '}
          <span className="font-semibold" style={{ color: peakLevel.color }}>
            {forecast.todayMax.toFixed(1)} ({peakLevel.label})
          </span>{' '}
          around {formatHour(forecast.peakHour)}.
        </p>

        {error && <p className="text-xs text-warning">Showing the last saved reading — {error}</p>}
      </Card>
      <p className="px-1 text-[11px] text-neutral-400">
        UV data: Open-Meteo{forecast.simulated ? ' · simulated value (?uv=off to reset)' : ''}
      </p>
    </section>
  );
}

/** One-line UV summary for screens where the full card would be too much. */
export function UvChip() {
  const { forecast } = useUvIndex();
  if (!forecast) return null;
  const level = uvLevel(forecast.current);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700 ring-1 ring-neutral-200">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: level.color }} aria-hidden="true" />
      UV {Math.round(forecast.current)} · {level.label} · {forecast.location.name}
    </span>
  );
}
