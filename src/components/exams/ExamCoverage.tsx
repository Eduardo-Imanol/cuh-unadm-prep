import { getExamCoverageList, type ExamMeta } from '@/data/exams';

interface ExamCoverageProps {
  exam: ExamMeta;
}

export function ExamCoverage({ exam }: ExamCoverageProps) {
  const coverage = getExamCoverageList(exam);
  const gridClass =
    coverage.length > 3
      ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'
      : 'grid grid-cols-1 gap-3 sm:grid-cols-3';

  return (
    <div className={gridClass}>
      {coverage.map(({ area, count, percentage }) => {
        const AreaIcon = area.icon;
        return (
          <div
            key={area.id}
            className="rounded-2xl border border-slate-100 bg-surface p-3 dark:border-slate-700/60 dark:bg-navy-dark"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${area.gradient}`}
              >
                <AreaIcon className="size-3.5 text-white" aria-hidden="true" />
              </span>
              <span className="truncate text-xs font-semibold text-navy dark:text-slate-200">
                {area.label}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${area.gradient}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {count} preguntas
            </p>
          </div>
        );
      })}
    </div>
  );
}
