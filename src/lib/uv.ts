/**
 * Local UV index from Open-Meteo (free, no API key, CORS-enabled).
 * MVP: a single fixed location — Ho Chi Minh City.
 */

export interface UvLocation {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const HCMC: UvLocation = {
  name: 'Ho Chi Minh City',
  latitude: 10.8231,
  longitude: 106.6297,
  timezone: 'Asia/Ho_Chi_Minh',
};

export interface UvHour {
  /** Local hour of day at the location, 0–23. */
  hour: number;
  uv: number;
}

export interface UvForecast {
  location: UvLocation;
  /** Current UV index (15-minute resolution). */
  current: number;
  isDay: boolean;
  /** Local time of the current reading at the location, "HH:MM". */
  observedAt: string;
  /** Local hour of the current reading, 0–23. */
  currentHour: number;
  hourly: UvHour[];
  todayMax: number;
  /** Local hour when today's UV peaks. */
  peakHour: number;
  /** When this forecast was fetched (ms since epoch). */
  fetchedAt: number;
  /** True when the current value comes from the ?uv= test override. */
  simulated?: boolean;
}

const OVERRIDE_KEY = 'uvie.uv-override';

/** Reads `?uv=` from the URL and remembers it for the browser tab; `?uv=off` clears it. */
function readUvOverride(): string | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('uv');
    if (fromUrl === 'off') {
      sessionStorage.removeItem(OVERRIDE_KEY);
      return null;
    }
    if (fromUrl !== null) {
      sessionStorage.setItem(OVERRIDE_KEY, fromUrl);
      return fromUrl;
    }
    return sessionStorage.getItem(OVERRIDE_KEY);
  } catch {
    return null;
  }
}

/**
 * Test override: open any page with `?uv=9` to pretend the current UV is 9 (daytime)
 * for the rest of the tab session; `?uv=off` goes back to live data. Lets the warnings
 * be checked at night or on a cloudy day.
 */
export function applyUvOverride(forecast: UvForecast): UvForecast {
  const raw = readUvOverride();
  const value = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(value) || value < 0) return forecast;
  return { ...forecast, current: value, isDay: true, simulated: true };
}

export type UvLevelId = 'low' | 'moderate' | 'high' | 'very-high' | 'extreme';

export interface UvLevel {
  id: UvLevelId;
  label: string;
  /** WHO UV index scale color. */
  color: string;
  advice: string;
  /** How often to re-scan the sticker outdoors, or null if not needed. */
  checkEveryMinutes: number | null;
}

/** WHO Global Solar UV Index categories. */
const LEVELS: Array<UvLevel & { min: number }> = [
  {
    min: 11,
    id: 'extreme',
    label: 'Extreme',
    color: '#6b49c8',
    advice: 'Avoid the sun around midday. Shade, cover up, and reapply often.',
    checkEveryMinutes: 45,
  },
  {
    min: 8,
    id: 'very-high',
    label: 'Very high',
    color: '#d8001d',
    advice: 'Unprotected skin burns fast. Seek shade and keep sunscreen topped up.',
    checkEveryMinutes: 60,
  },
  {
    min: 6,
    id: 'high',
    label: 'High',
    color: '#f85900',
    advice: 'Sunscreen, hat and sunglasses outdoors. Shade at midday.',
    checkEveryMinutes: 90,
  },
  {
    min: 3,
    id: 'moderate',
    label: 'Moderate',
    color: '#e0c200',
    advice: 'Wear sunscreen if you are outside for more than a short while.',
    checkEveryMinutes: 120,
  },
  {
    min: 0,
    id: 'low',
    label: 'Low',
    color: '#4eb400',
    advice: 'Little risk right now. No reminder needed.',
    checkEveryMinutes: null,
  },
];

export function uvLevel(uv: number): UvLevel {
  const rounded = Math.round(uv);
  const level = LEVELS.find((entry) => rounded >= entry.min) ?? LEVELS[LEVELS.length - 1];
  const { min: _min, ...rest } = level;
  return rest;
}

/** UV at or above this (WHO "High") triggers an in-app warning. */
export const UV_WARNING_THRESHOLD = 6;

export function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

interface OpenMeteoResponse {
  current: { time: string; uv_index: number; is_day: number };
  hourly: { time: string[]; uv_index: number[] };
  daily: { uv_index_max: number[] };
}

/** "2026-11-15T13:45" -> 13 */
function hourOf(isoLocal: string): number {
  return Number(isoLocal.slice(11, 13));
}

export async function fetchUvForecast(
  location: UvLocation = HCMC,
  signal?: AbortSignal,
): Promise<UvForecast> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'uv_index,is_day',
    hourly: 'uv_index',
    daily: 'uv_index_max',
    timezone: location.timezone,
    forecast_days: '1',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`UV service responded with ${response.status}.`);
  }
  const data = (await response.json()) as OpenMeteoResponse;

  const hourly = data.hourly.time.map((time, index) => ({
    hour: hourOf(time),
    uv: data.hourly.uv_index[index] ?? 0,
  }));
  const peak = hourly.reduce((best, entry) => (entry.uv > best.uv ? entry : best), hourly[0]);

  return {
    location,
    current: data.current.uv_index ?? 0,
    isDay: data.current.is_day === 1,
    observedAt: data.current.time.slice(11, 16),
    currentHour: hourOf(data.current.time),
    hourly,
    todayMax: data.daily.uv_index_max[0] ?? peak?.uv ?? 0,
    peakHour: peak?.hour ?? 12,
    fetchedAt: Date.now(),
  };
}

const CACHE_KEY = 'uvie.uv.v1';
/** Open-Meteo updates "current" every 15 minutes. */
export const UV_CACHE_MS = 15 * 60_000;

export function loadCachedUv(): UvForecast | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as UvForecast;
    return typeof cached?.fetchedAt === 'number' ? cached : null;
  } catch {
    return null;
  }
}

export function saveCachedUv(forecast: UvForecast): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(forecast));
  } catch {
    // Best-effort cache.
  }
}
