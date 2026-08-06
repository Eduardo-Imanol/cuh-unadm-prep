import { GraduationCap, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const LOADING_TIMEOUT_MS = 8_000;

function AuthSplash() {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setTimedOut(false);
    useAuthStore.getState().subscribeToAuth();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-light to-navy shadow-lg shadow-navy-dark/40 ring-1 ring-white/10">
        <GraduationCap className="size-8 text-emerald" aria-hidden="true" />
      </div>
      {!timedOut ? (
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Cargando sesión…
        </div>
      ) : (
        <div className="mt-6 w-full max-w-sm rounded-3xl border border-white/10 bg-navy-light/60 p-6 text-center shadow-xl">
          <p className="text-sm font-semibold text-white">No pudimos verificar tu sesión</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Parece que Firebase Authentication no está disponible o hay problemas de conexión.
            Revisa que la autenticación esté habilitada en la consola de Firebase.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}

export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === 'idle' || status === 'loading') {
    return <AuthSplash />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
