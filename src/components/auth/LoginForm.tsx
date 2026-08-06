import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, UserPlus } from 'lucide-react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { AuthErrorAlert } from './AuthErrorAlert';
import { AuthField } from './AuthField';
import { GoogleButton } from './GoogleButton';

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  const activeClasses = active
    ? 'bg-white text-navy shadow-sm dark:bg-navy-light dark:text-slate-100'
    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-1 dark:focus-visible:ring-offset-navy-dark ${activeClasses}`}
    >
      {children}
    </button>
  );
}

export function LoginForm() {
  const {
    mode,
    email,
    password,
    confirmPassword,
    fieldErrors,
    submitError,
    isSubmitting,
    isPasswordVisible,
    setMode,
    setEmail,
    setPassword,
    setConfirmPassword,
    togglePasswordVisibility,
    handleSubmit,
  } = useLoginForm();

  const isRegister = mode === 'register';
  const passwordAutoComplete = isRegister ? 'new-password' : 'current-password';

  return (
    <div className="mt-8">
      <div
        role="group"
        aria-label="Modo de acceso"
        className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-navy-dark"
      >
        <ModeButton active={!isRegister} onClick={() => setMode('login')}>
          Iniciar sesión
        </ModeButton>
        <ModeButton active={isRegister} onClick={() => setMode('register')}>
          Crear cuenta
        </ModeButton>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="space-y-4">
          <AuthField
            id="login-email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
            icon={Mail}
            error={fieldErrors.email ?? undefined}
          />
          <AuthField
            id="login-password"
            label="Contraseña"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete={passwordAutoComplete}
            icon={Lock}
            error={fieldErrors.password ?? undefined}
            trailing={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-1 dark:text-slate-500 dark:hover:text-slate-300 dark:focus-visible:ring-offset-navy-light"
              >
                {isPasswordVisible ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            }
          />
          {isRegister ? (
            <AuthField
              id="register-confirm"
              label="Confirmar contraseña"
              type={isPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={Lock}
              error={fieldErrors.confirmPassword ?? undefined}
            />
          ) : null}
        </div>

        <AnimatePresence>{submitError ? <AuthErrorAlert message={submitError} /> : null}</AnimatePresence>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          {...(isSubmitting ? {} : { whileTap: { scale: 0.98 } })}
          aria-busy={isSubmitting}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald/30 transition-colors duration-200 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-emerald-500 dark:focus-visible:ring-offset-navy-light"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : isRegister ? (
            <UserPlus className="size-4" aria-hidden="true" />
          ) : (
            <LogIn className="size-4" aria-hidden="true" />
          )}
          {isSubmitting
            ? isRegister
              ? 'Creando cuenta…'
              : 'Verificando credenciales…'
            : isRegister
              ? 'Crear cuenta'
              : 'Iniciar sesión'}
        </motion.button>

        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isRegister ? 'o regístrate con' : 'o continúa con'}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <GoogleButton />

        {isRegister ? (
          <p className="text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            Al usar Google se crea tu cuenta automáticamente si aún no existe.
          </p>
        ) : null}
      </form>
    </div>
  );
}
