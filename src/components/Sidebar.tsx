import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AI_CONFIG_ITEM, NAV_ITEMS } from '@/data/navigation';

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function linkClasses(isActive: boolean): string {
  return `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${
    isActive
      ? 'bg-emerald/15 text-emerald'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;
}

function Brand({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <NavLink
      to="/"
      onClick={onNavigate}
      aria-label="Ir al inicio de CUH / UnADM 2026 Prep"
      className="flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-light to-navy shadow-lg shadow-navy-dark/40 ring-1 ring-white/10">
        <GraduationCap className="size-6 text-emerald" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-base font-bold tracking-tight text-white">CUH</span>
        <span className="block text-[11px] font-medium text-slate-400">UnADM 2026 Prep</span>
      </span>
    </NavLink>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-navy">
      <div className="border-b border-white/10 px-4 py-5">
        <Brand onNavigate={onNavigate} />
      </div>

      <nav aria-label="Navegación principal" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) => linkClasses(isActive)}
          >
            {({ isActive }) => (
              <>
                <item.icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
                {isActive ? (
                  <span
                    className="ml-auto size-1.5 shrink-0 rounded-full bg-emerald"
                    aria-hidden="true"
                  />
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <NavLink
          to={AI_CONFIG_ITEM.path}
          onClick={onNavigate}
          className={({ isActive }) => linkClasses(isActive)}
        >
          {({ isActive }) => (
            <>
              <AI_CONFIG_ITEM.icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{AI_CONFIG_ITEM.label}</span>
              {isActive ? (
                <span className="ml-auto size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
              ) : null}
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <aside className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-30 w-72">
          <SidebarContent />
        </div>
      </aside>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.button
              type="button"
              aria-label="Cerrar menú de navegación"
              className="absolute inset-0 size-full cursor-default bg-navy-dark/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              className="absolute inset-y-0 left-0 w-72 shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            >
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
