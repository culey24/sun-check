import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'danger' | 'success' | 'warning';

const TONES: Record<Tone, string> = {
  danger: 'bg-danger/10 border-danger/30 text-danger',
  success: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
};

interface AlertBannerProps {
  tone: Tone;
  title: string;
  children?: ReactNode;
}

export default function AlertBanner({ tone, title, children }: AlertBannerProps) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={['rounded-2xl border p-4', TONES[tone]].join(' ')}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">{title}</p>
          {children ? <div className="mt-1 text-sm">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
