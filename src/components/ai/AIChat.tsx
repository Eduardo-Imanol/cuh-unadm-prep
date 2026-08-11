import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  Bot,
  Loader2,
  Send,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAIChatStore } from '@/store/aiChatStore';
import { useAIStore } from '@/store/aiStore';
import { getPageContext, type PageContext } from '@/utils/chatContext';

function WelcomeBubble() {
  return (
    <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-emerald/20 bg-emerald/5 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
      ¡Hola! Soy tu tutor de estudio. Pregúntame cualquier duda sobre el Examen CUH
      o sobre lo que estás viendo en esta pantalla.
    </div>
  );
}

function ChatBubble({
  role,
  content,
  isError,
}: {
  role: 'user' | 'assistant';
  content: string;
  isError: boolean;
}) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-emerald to-emerald/90 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm shadow-emerald/20">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
          isError ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald/10 text-emerald'
        }`}
        aria-hidden="true"
      >
        {isError ? <AlertCircle className="size-4" /> : <Bot className="size-4" />}
      </span>
      <div
        className={`max-w-[85%] rounded-2xl rounded-tl-sm border px-3.5 py-2.5 text-sm leading-relaxed ${
          isError
            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
            : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-navy-dark dark:text-slate-200'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export function AIChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const contextDetail = useAIChatStore((state) => state.contextDetail);
  const baseContext = getPageContext(location.pathname);
  const context: PageContext =
    contextDetail !== null && contextDetail.trim().length > 0
      ? { ...baseContext, detail: contextDetail }
      : baseContext;

  const isOpen = useAIChatStore((state) => state.isOpen);
  const isLoading = useAIChatStore((state) => state.isLoading);
  const entries = useAIChatStore((state) => state.entries);
  const toggle = useAIChatStore((state) => state.toggle);
  const close = useAIChatStore((state) => state.close);
  const sendMessage = useAIChatStore((state) => state.sendMessage);

  const hasKey = useAIStore((state) => state.apiKey.trim().length > 0);

  const reduceMotion = useReducedMotion();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const list = scrollRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [entries, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (text.length === 0 || isLoading || !hasKey) {
      return;
    }
    setDraft('');
    void sendMessage(text, context);
  };

  const goToConfig = () => {
    close();
    navigate('/config-ia');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chat con el tutor IA"
            className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-navy/25 dark:border-slate-700 dark:bg-navy-light sm:right-6"
            style={{ height: 'min(70vh, 32rem)' }}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.96 }
            }
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <header className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-navy to-navy-light px-4 py-3.5 dark:border-slate-700">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald/15 text-emerald ring-1 ring-emerald/30">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold tracking-tight text-white">Tutor CUH</p>
                <p className="truncate text-[11px] font-medium text-slate-300">
                  {context.detail ?? context.title}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar chat"
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            {hasKey ? (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4 dark:bg-navy-dark/50"
                  role="log"
                  aria-live="polite"
                  aria-label="Mensajes del chat"
                >
                  {entries.length === 0 ? <WelcomeBubble /> : null}
                  {entries.map((entry) => (
                    <ChatBubble
                      key={entry.id}
                      role={entry.role}
                      content={entry.content}
                      isError={entry.isError}
                    />
                  ))}
                  {isLoading ? (
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
                        <Bot className="size-4" aria-hidden="true" />
                      </span>
                      <span className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 dark:border-slate-700 dark:bg-navy-dark">
                        <Loader2 className="size-4 animate-spin text-emerald" aria-hidden="true" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Pensando…
                        </span>
                      </span>
                    </div>
                  ) : null}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex items-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-navy-light"
                >
                  <label htmlFor="ai-chat-input" className="sr-only">
                    Escribe tu pregunta
                  </label>
                  <input
                    id="ai-chat-input"
                    ref={inputRef}
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Pregunta sobre el examen…"
                    autoComplete="off"
                    maxLength={500}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-navy shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald focus:bg-white focus:ring-2 focus:ring-emerald/25 dark:border-slate-700 dark:bg-navy-dark dark:text-slate-100"
                  />
                  <motion.button
                    type="submit"
                    aria-label="Enviar mensaje"
                    disabled={isLoading || draft.trim().length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald to-emerald/90 text-white shadow-md shadow-emerald/30 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="size-4" aria-hidden="true" />
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald/10 text-emerald">
                  <Settings2 className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-slate-100">
                    Conecta tu IA para chatear
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Agrega tu API key de OpenRouter, OpenAI o Gemini en un minuto y empieza
                    a resolver tus dudas con el tutor.
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={goToConfig}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald to-emerald/90 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-light"
                >
                  <Settings2 className="size-4" aria-hidden="true" />
                  Configurar IA
                </motion.button>
              </div>
            )}
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? 'Cerrar chat con el tutor IA' : 'Abrir chat con el tutor IA'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-emerald/90 text-white shadow-xl shadow-emerald/30 ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-navy-dark"
      >
        {isOpen ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Sparkles className="size-6" aria-hidden="true" />
        )}
      </motion.button>
    </>
  );
}
