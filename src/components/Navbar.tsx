import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Globe, Loader2, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export interface NavbarProps {
  onOpenMenu: () => void;
}

function WindowControls() {
  return (
    <div className="hidden items-center gap-2 sm:flex" aria-hidden="true">
      <span className="size-3 rounded-full bg-[#FF5F57]" />
      <span className="size-3 rounded-full bg-[#FEBC2E]" />
      <span className="size-3 rounded-full bg-[#28C840]" />
    </div>
  );
}

function getInitial(name: string | null | undefined, email: string | null | undefined): string {
  const source = name?.trim() || email?.trim() || 'U';
  return source.charAt(0).toUpperCase();
}

function ProfileMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = user?.displayName ?? user?.email ?? 'Usuario';
  const initial = getInitial(user?.displayName, user?.email);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Menú de perfil"
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-navy dark:focus-visible:ring-offset-navy-light"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-emerald/60 text-sm font-bold text-white ring-2 ring-white dark:ring-navy-light">
          {initial}
        </span>
        <span className="hidden max-w-40 truncate text-sm font-medium text-navy dark:text-slate-200 md:inline">
          {displayName}
        </span>
        <ChevronDown
          className={`size-4 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="menu"
            aria-label="Opciones de perfil"
            className="absolute right-0 top-full mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-navy-light"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <p className="text-sm font-semibold text-navy dark:text-slate-100">{displayName}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
            </div>
            <div className="p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={toggleTheme}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald dark:text-slate-300 dark:hover:bg-navy"
              >
                {mode === 'dark' ? (
                  <Sun className="size-4 text-emerald" aria-hidden="true" />
                ) : (
                  <Moon className="size-4 text-emerald" aria-hidden="true" />
                )}
                Cambiar a modo {mode === 'dark' ? 'claro' : 'oscuro'}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-navy"
              >
                {isSigningOut ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <LogOut className="size-4" aria-hidden="true" />
                )}
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Navbar({ onOpenMenu }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-navy-light/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú de navegación"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald dark:text-slate-400 dark:hover:bg-navy dark:hover:text-slate-100 lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <WindowControls />

        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-navy-dark dark:text-slate-300">
            <Globe className="size-3.5 text-emerald" aria-hidden="true" />
            <span className="truncate">cuh-unadm-pwa.app</span>
          </div>
        </div>

        <ProfileMenu />
      </div>
    </header>
  );
}
