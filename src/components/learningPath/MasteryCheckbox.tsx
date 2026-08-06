import { Check } from 'lucide-react';

interface MasteryCheckboxProps {
  id: string;
  label: string;
  mastered: boolean;
  onToggle: () => void;
}

export function MasteryCheckbox({ id, label, mastered, onToggle }: MasteryCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`group flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-emerald focus-within:ring-offset-1 focus-within:ring-offset-white dark:focus-within:ring-offset-navy-light ${
        mastered
          ? 'border-emerald/40 bg-emerald/5'
          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-surface dark:border-slate-700/60 dark:bg-navy-dark dark:hover:border-slate-600'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={mastered}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
          mastered
            ? 'border-emerald bg-emerald text-white'
            : 'border-slate-300 bg-white text-transparent group-hover:border-emerald/50 dark:border-slate-600 dark:bg-navy-light'
        }`}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span
        className={`text-sm leading-relaxed transition-colors ${
          mastered
            ? 'text-slate-500 line-through decoration-emerald/40 dark:text-slate-400'
            : 'text-slate-600 dark:text-slate-300'
        }`}
      >
        {label}
      </span>
    </label>
  );
}
