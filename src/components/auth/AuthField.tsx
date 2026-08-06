import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface AuthFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'email' | 'password' | 'text' | undefined;
  placeholder?: string | undefined;
  autoComplete?: string | undefined;
  icon?: LucideIcon | undefined;
  error?: string | undefined;
  trailing?: ReactNode | undefined;
}

export function AuthField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  icon: Icon,
  error,
  trailing,
}: AuthFieldProps) {
  const stateClasses = error
    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
    : 'border-slate-200 focus:border-emerald focus:ring-emerald/25 dark:border-slate-700';
  const leadingClasses = Icon ? 'pl-11' : 'pl-4';
  const trailingClasses = trailing ? 'pr-11' : 'pr-4';
  const ariaProps = error
    ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` }
    : {};

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...ariaProps}
          className={`w-full rounded-xl border py-3 text-sm text-navy shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2 disabled:opacity-60 dark:bg-navy-dark dark:text-slate-100 dark:placeholder:text-slate-500 ${stateClasses} ${leadingClasses} ${trailingClasses}`}
        />
        {trailing ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
