import { LoginCard } from '@/components/auth/LoginCard';

export default function Login() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4 py-10 dark:bg-navy-dark sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-24 size-72 rounded-full bg-emerald/10 blur-3xl dark:bg-emerald/15" />
        <div className="absolute -bottom-28 -left-20 size-80 rounded-full bg-navy/10 blur-3xl dark:bg-navy-light/40" />
      </div>
      <LoginCard />
    </main>
  );
}
