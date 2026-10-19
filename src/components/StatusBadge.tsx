import { AlertTriangle, ShieldCheck } from 'lucide-react';
import type { StickerState } from '../lib/types';
import { STATE_LABEL } from '../lib/types';

const STYLES: Record<StickerState, { classes: string; Icon: typeof ShieldCheck }> = {
  protected: {
    classes: 'bg-success/10 text-success ring-success/20',
    Icon: ShieldCheck,
  },
  reapply: {
    classes: 'bg-danger/10 text-danger ring-danger/20',
    Icon: AlertTriangle,
  },
};

interface StatusBadgeProps {
  state: StickerState;
  className?: string;
}

export default function StatusBadge({ state, className = '' }: StatusBadgeProps) {
  const { classes, Icon } = STYLES[state];
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1',
        classes,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {STATE_LABEL[state]}
    </span>
  );
}
