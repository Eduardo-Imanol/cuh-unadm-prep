interface ProgressBarProps {
  value: number;
  label?: string | undefined;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>{label ?? `${safeValue}% completado`}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald/80 transition-all duration-500 ease-out"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
