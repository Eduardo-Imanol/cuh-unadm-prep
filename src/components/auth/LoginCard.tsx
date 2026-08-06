import { useAuthStore } from '@/store/authStore';
import { AuthWelcome } from './AuthWelcome';
import { BrandBadge } from './BrandBadge';
import { LoginForm } from './LoginForm';

export function LoginCard() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-card dark:border-slate-700/60 dark:bg-navy-light sm:p-10">
      <BrandBadge />
      {isAuthenticated ? <AuthWelcome /> : <LoginForm />}
    </div>
  );
}
