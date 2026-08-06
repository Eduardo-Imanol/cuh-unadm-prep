import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  icon?: LucideIcon | undefined;
  badge?: ReactNode | undefined;
  layout?: 'center' | 'side-by-side';
  children: ReactNode;
}

export function MetricCard({
  title,
  icon: Icon,
  badge,
  layout = 'center',
  children,
}: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-700/60 dark:bg-navy-light">
      <header className="mb-4 flex items-center gap-3">
        {Icon !== undefined ? (
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        ) : null}
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</h3>
        {badge !== undefined ? (
          <div className="ml-auto">{badge}</div>
        ) : null}
      </header>

      <div className={layout === 'side-by-side' ? 'flex items-center gap-4' : 'flex flex-col items-center'}>
        {children}
      </div>
    </div>
  );
}
