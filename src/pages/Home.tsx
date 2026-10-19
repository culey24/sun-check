import { Link } from 'react-router-dom';
import { Camera, ScanLine, Sun, TriangleAlert } from 'lucide-react';
import { buttonClasses } from '../components/Button';
import Card from '../components/Card';

const STEPS = [
  {
    Icon: ScanLine,
    title: '1. Scan the sticker',
    body: 'Point your camera at the UV sticker and tap capture.',
  },
  {
    Icon: Sun,
    title: '2. We read the color',
    body: 'A light sticker means your sunscreen is still working.',
  },
  {
    Icon: TriangleAlert,
    title: '3. Get reminded',
    body: 'When the sticker turns dark, we tell you to reapply.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col items-start gap-3 pt-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          UV sun safety
        </span>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Know exactly when to reapply your sunscreen.
        </h1>
        <p className="text-neutral-600">
          SunCheck reads your UV-sensitive sticker and warns you the moment it turns
          dark — so you never get caught out in the sun.
        </p>
        <Link to="/scan" className={buttonClasses('primary', 'lg', true, 'mt-1')}>
          <Camera className="h-5 w-5" aria-hidden="true" />
          Scan sticker
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          How it works
        </h2>
        {STEPS.map(({ Icon, title, body }) => (
          <Card key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-neutral-600">{body}</p>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
