import { GraduationCap } from 'lucide-react';

export function BrandBadge() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-navy-light shadow-lg shadow-navy/25 ring-1 ring-navy/10 dark:from-navy-light dark:to-navy dark:shadow-navy/40 dark:ring-navy">
        <GraduationCap className="size-8 text-emerald" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-navy dark:text-slate-50">CUH</h1>
      <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">UnADM 2026 Prep</p>
    </div>
  );
}
