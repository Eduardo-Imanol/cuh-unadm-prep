import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthWelcome() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="mt-8 flex flex-col items-center text-center"
    >
      <CheckCircle2 className="size-10 text-emerald" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-navy dark:text-slate-100">Sesión iniciada</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isSigningOut}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy shadow-sm transition-colors hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-navy-light dark:text-slate-100 dark:hover:border-navy dark:hover:bg-navy dark:focus-visible:ring-offset-navy-light"
      >
        {isSigningOut ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogOut className="size-4" aria-hidden="true" />
        )}
        Cerrar sesión
      </button>
    </motion.div>
  );
}
