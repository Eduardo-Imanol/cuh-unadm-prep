import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthServiceError, signInWithGoogle } from './googleAuth';

const mocks = vi.hoisted(() => ({
  signInWithPopup: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class GoogleAuthProvider {
    readonly providerId = 'google.com';
  },
  signInWithPopup: mocks.signInWithPopup,
}));

vi.mock('@/services/firebase', () => ({ auth: {} }));

describe('signInWithGoogle', () => {
  beforeEach(() => {
    mocks.signInWithPopup.mockReset();
  });

  it('returns the authenticated user on success', async () => {
    const fakeUser = { uid: 'u1', email: 'estudiante@unadm.mx' };
    mocks.signInWithPopup.mockResolvedValue({ user: fakeUser });

    await expect(signInWithGoogle()).resolves.toEqual(fakeUser);
  });

  it('maps a closed popup to a friendly message', async () => {
    mocks.signInWithPopup.mockRejectedValue({ code: 'auth/popup-closed-by-user' });

    const error = await signInWithGoogle().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(AuthServiceError);
    expect((error as AuthServiceError).message).toContain('Cerraste');
  });

  it('throws a generic message for unknown error codes', async () => {
    mocks.signInWithPopup.mockRejectedValue({ code: 'auth/weird' });

    const error = await signInWithGoogle().catch((caught: unknown) => caught);

    expect((error as AuthServiceError).message).toBe('Ocurrió un error al autenticar.');
  });
});
