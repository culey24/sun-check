import { NavLink, Outlet } from 'react-router-dom';
import { Home, History as HistoryIcon, ScanLine } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const NAV: { to: string; label: string; Icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/scan', label: 'Scan', Icon: ScanLine },
  { to: '/history', label: 'History', Icon: HistoryIcon },
];

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-neutral-100">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur">
        <span className="text-lg font-bold tracking-tight text-primary">SunCheck</span>
      </header>

      <main className="flex-1 px-4 py-5 pb-24">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-md items-stretch justify-around border-t border-neutral-200 bg-white/95 backdrop-blur">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800',
              ].join(' ')
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
