import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Laptop,
  type LucideIcon,
} from 'lucide-react';
import { getAreaStudyTopics } from '@/data/exams';
import type { SubjectMetric, SubjectIconName } from '@/hooks/useDashboardData';

interface SubjectCardProps {
  subject: SubjectMetric;
}

const ICON_MAP: Record<SubjectIconName, LucideIcon> = {
  BookOpen,
  Calculator,
  Laptop,
  Globe,
  Landmark,
  FlaskConical,
};

function studyPriority(subject: SubjectMetric): { label: string; className: string } | undefined {
  if (subject.examScore === undefined) {
    return undefined;
  }
  if (subject.examScore >= 80) {
    return { label: 'Área dominada', className: 'text-emerald' };
  }
  if (subject.examScore >= 60) {
    return { label: 'En progreso · refuerza', className: 'text-amber-600 dark:text-amber-400' };
  }
  return { label: 'Prioridad de estudio', className: 'text-rose-500' };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = ICON_MAP[subject.iconName];
  const priority = studyPriority(subject);
  const weakTopics =
    subject.examScore !== undefined && subject.examScore < 60
      ? getAreaStudyTopics(subject.id).slice(0, 2)
      : [];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/5 dark:border-slate-700/60 dark:bg-navy-light">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald to-emerald/70 shadow-lg">
        <Icon className="size-5 text-white" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-navy dark:text-slate-100">{subject.name}</h4>
          <span className="text-xs font-bold text-emerald">{subject.percentage}%</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subject.badgeText}</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald/80 transition-all duration-500 ease-out"
            style={{ width: `${subject.percentage}%` }}
          />
        </div>
        {subject.totalLessons > 0 ? (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {subject.completedLessons}/{subject.totalLessons} temas dominados
          </p>
        ) : null}
        <p className="mt-0.5 text-xs font-medium text-emerald">
          {subject.examScore !== undefined
            ? `Mejor simulacro: ${subject.examScore}% · ${subject.examAttempts} ${subject.examAttempts === 1 ? 'intento' : 'intentos'}`
            : 'Sin simulacros realizados'}
        </p>
        {priority ? (
          <p className={`mt-0.5 text-xs font-semibold ${priority.className}`}>{priority.label}</p>
        ) : null}
        {weakTopics.length > 0 ? (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Qué estudiar: {weakTopics.join(' · ')}
          </p>
        ) : null}
      </div>
    </div>
  );
}
