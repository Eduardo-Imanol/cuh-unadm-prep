import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthStore } from '@/store/authStore';
import { useLoginForm } from './useLoginForm';

type LoginState = Pick<AuthStore, 'user' | 'status' | 'error'>;
type LoginStoreState = LoginState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
};

const mocks = vi.hoisted(() => {
  const login = vi.fn<(email: string, password: string) => Promise<void>>();
  const register = vi.fn<(email: string, password: string) => Promise<void>>();
  let state: LoginStoreState = {
    user: null,
    status: 'unauthenticated',
    error: null,
    login,
    register,
  };
  const selector = <T>(fn: (state: LoginStoreState) => T): T => fn(state);
  const store = Object.assign(selector, {
    getState: () => state,
    setState: (partial: Partial<LoginStoreState>) => {
      state = { ...state, ...partial };
    },
  });
  return { store, login, register };
});

vi.mock('@/store/authStore', () => ({ useAuthStore: mocks.store }));

function submitEvent(): { preventDefault: () => void } {
  return { preventDefault: vi.fn() };
}

describe('useLoginForm', () => {
  beforeEach(() => {
    mocks.login.mockReset();
    mocks.register.mockReset();
    mocks.login.mockResolvedValue(undefined);
    mocks.register.mockResolvedValue(undefined);
    mocks.store.setState({ user: null, status: 'unauthenticated', error: null });
  });

  it('starts in login mode with empty fields and no errors', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.mode).toBe('login');
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.fieldErrors.email).toBeNull();
    expect(result.current.submitError).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('switches between login and register modes clearing errors', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setMode('register'));
    expect(result.current.mode).toBe('register');

    act(() => result.current.setMode('login'));
    expect(result.current.mode).toBe('login');
  });

  it('rejects an invalid email without calling login', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setEmail('no-es-un-email'));
    act(() => result.current.setPassword('secreto123'));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.fieldErrors.email).toContain('inválido');
    expect(mocks.login).not.toHaveBeenCalled();
  });

  it('rejects a missing password', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setEmail('estudiante@unadm.mx'));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.fieldErrors.password).toContain('contraseña');
  });

  it('calls login with credentials on a valid submit', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setEmail('estudiante@unadm.mx'));
    act(() => result.current.setPassword('secreto'));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(mocks.login).toHaveBeenCalledWith('estudiante@unadm.mx', 'secreto');
    expect(result.current.submitError).toBeNull();
  });

  it('surfaces a store error after a failed login', async () => {
    mocks.login.mockImplementation(async () => {
      mocks.store.setState({ status: 'error', error: 'Correo o contraseña incorrectos.' });
    });

    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setEmail('estudiante@unadm.mx'));
    act(() => result.current.setPassword('mal'));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.submitError).toContain('incorrectos');
  });

  it('rejects a short password in register mode', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setMode('register'));
    act(() => result.current.setEmail('nuevo@unadm.mx'));
    act(() => result.current.setPassword('123'));
    act(() => result.current.setConfirmPassword('123'));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.fieldErrors.password).toContain('6 caracteres');
    expect(mocks.register).not.toHaveBeenCalled();
  });

  it('rejects mismatched passwords in register mode', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setMode('register'));
    act(() => result.current.setEmail('nuevo@unadm.mx'));
    act(() => result.current.setPassword('secreto123'));
    act(() => result.current.setConfirmPassword('otra12345'));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.fieldErrors.confirmPassword).toContain('no coinciden');
  });

  it('calls register with credentials on a valid register submit', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => result.current.setMode('register'));
    act(() => result.current.setEmail('nuevo@unadm.mx'));
    act(() => result.current.setPassword('secreto123'));
    act(() => result.current.setConfirmPassword('secreto123'));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(mocks.register).toHaveBeenCalledWith('nuevo@unadm.mx', 'secreto123');
    expect(mocks.login).not.toHaveBeenCalled();
  });

  it('toggles password visibility', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.isPasswordVisible).toBe(false);
    act(() => result.current.togglePasswordVisibility());
    expect(result.current.isPasswordVisible).toBe(true);
  });
});
