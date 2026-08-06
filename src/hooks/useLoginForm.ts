import { useCallback, useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';

export type LoginMode = 'login' | 'register';

const emailSchema = z
  .string()
  .min(1, 'Ingresa tu correo electrónico.')
  .email('Correo electrónico inválido.');
const passwordSchema = z.string().min(1, 'Ingresa tu contraseña.');

const loginSchema = z.object({ email: emailSchema, password: passwordSchema });

const registerSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export interface FieldErrors {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}

export interface UseLoginFormResult {
  mode: LoginMode;
  email: string;
  password: string;
  confirmPassword: string;
  fieldErrors: FieldErrors;
  submitError: string | null;
  isSubmitting: boolean;
  isPasswordVisible: boolean;
  setMode: (mode: LoginMode) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: (event: { preventDefault: () => void }) => Promise<void>;
}

const EMPTY_ERRORS: FieldErrors = { email: null, password: null, confirmPassword: null };

interface FieldErrorInput {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

function toFieldErrors(errors: FieldErrorInput): FieldErrors {
  return {
    email: errors.email?.[0] ?? null,
    password: errors.password?.[0] ?? null,
    confirmPassword: errors.confirmPassword?.[0] ?? null,
  };
}

export function useLoginForm(): UseLoginFormResult {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const [mode, setModeState] = useState<LoginMode>('login');
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [confirmPassword, setConfirmPasswordState] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const setMode = useCallback((next: LoginMode) => {
    setModeState(next);
    setFieldErrors(EMPTY_ERRORS);
    setSubmitError(null);
  }, []);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    setFieldErrors((current) => (current.email ? { ...current, email: null } : current));
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setFieldErrors((current) => (current.password ? { ...current, password: null } : current));
  }, []);

  const setConfirmPassword = useCallback((value: string) => {
    setConfirmPasswordState(value);
    setFieldErrors((current) =>
      current.confirmPassword ? { ...current, confirmPassword: null } : current,
    );
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((visible) => !visible);
  }, []);

  const handleSubmit = useCallback(
    async (event: { preventDefault: () => void }) => {
      event.preventDefault();

      const input = { email, password, confirmPassword };
      const result =
        mode === 'register' ? registerSchema.safeParse(input) : loginSchema.safeParse(input);

      if (!result.success) {
        setFieldErrors(toFieldErrors(result.error.flatten().fieldErrors));
        setSubmitError(null);
        return;
      }

      setFieldErrors(EMPTY_ERRORS);
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        if (mode === 'register') {
          await register(result.data.email, result.data.password);
        } else {
          await login(result.data.email, result.data.password);
        }
        const state = useAuthStore.getState();
        if (state.status === 'error') {
          setSubmitError(state.error ?? 'No se pudo completar la operación.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, email, password, confirmPassword, login, register],
  );

  return {
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
  };
}
