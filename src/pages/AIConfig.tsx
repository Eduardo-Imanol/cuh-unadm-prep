import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { useAIConfig, type AIConfigStatus } from '@/hooks/useAIConfig';

const STATUS_STYLES: Record<
  AIConfigStatus,
  { text: string; className: string; dot: string }
> = {
  idle: { text: 'Sin configurar', className: 'text-slate-500', dot: 'bg-slate-400' },
  testing: { text: 'Probando conexión…', className: 'text-amber-500', dot: 'bg-amber-400' },
  saved: { text: 'Key activa', className: 'text-emerald', dot: 'bg-emerald' },
  error: { text: 'Error', className: 'text-rose-500', dot: 'bg-rose-400' },
  cleared: { text: 'Key eliminada', className: 'text-slate-500', dot: 'bg-slate-400' },
};

export default function AIConfig() {
  const config = useAIConfig();
  const status = STATUS_STYLES[config.status];

  return (
    <motion.main
      className="w-full space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald">Asistente inteligente</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy dark:text-slate-50">
            Configurar IA
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Conecta tu propia API key (OpenRouter/OpenAI) para asistencia personalizada.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
          <span className={`size-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
          {status.text}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-700/60 dark:bg-navy-light lg:col-span-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
              <KeyRound className="size-5" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-navy dark:text-slate-100">
              Tu API Key
            </h2>
          </div>

          <div className="mt-5 space-y-1.5">
            <label htmlFor="ai-key" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              API Key
            </label>
            <div className="relative">
              <input
                id="ai-key"
                type={config.isKeyVisible ? 'text' : 'password'}
                value={config.draftKey}
                onChange={(event) => config.setDraftKey(event.target.value)}
                placeholder="sk-or-v1-…"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 font-mono text-sm text-navy shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald focus:bg-white focus:ring-2 focus:ring-emerald/25 dark:border-slate-700 dark:bg-navy-dark dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={config.toggleVisibility}
                aria-label={config.isKeyVisible ? 'Ocultar API key' : 'Mostrar API key'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                {config.isKeyVisible ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {config.message ? (
            <p
              role="status"
              className={`mt-3 text-sm font-medium ${config.status === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {config.message}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={() => void config.testKey()}
              disabled={config.status === 'testing'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-navy-light"
            >
              {config.status === 'testing' ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Zap className="size-4" aria-hidden="true" />
              )}
              Probar y guardar
            </motion.button>

            <motion.button
              type="button"
              onClick={config.saveKey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-navy"
            >
              <Save className="size-4" aria-hidden="true" />
              Guardar
            </motion.button>

            {config.isConfigured ? (
              <motion.button
                type="button"
                onClick={config.clearKey}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Eliminar key
              </motion.button>
            ) : null}
          </div>
        </section>

        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-emerald/20 bg-gradient-to-br from-emerald/10 to-transparent p-6 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald/15 text-emerald">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-semibold text-navy dark:text-slate-100">Privacidad BYOK</h3>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
                Tu key solo se guarda cifrada en memoria y en esta sesión del navegador.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
                Las llamadas salen directamente de tu dispositivo, nunca pasan por un servidor.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
                Puedes eliminar la key en cualquier momento con un clic.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-700/60 dark:bg-navy-light">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-navy/10 text-navy dark:bg-white/10 dark:text-slate-100">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-semibold text-navy dark:text-slate-100">¿Qué puedes hacer?</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Una vez conectada, la IA podrá generar preguntas personalizadas, corregir tus simuladores
              y recomendarte áreas de estudio según tu progreso.
            </p>
          </div>
        </section>
      </div>
    </motion.main>
  );
}
