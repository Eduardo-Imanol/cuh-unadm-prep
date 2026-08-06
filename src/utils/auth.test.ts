import { describe, expect, it } from 'vitest';
import { isValidEmail, mapAuthErrorMessage } from './auth';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('estudiante@unadm.mx')).toBe(true);
  });

  it('rejects malformed emails', () => {
    expect(isValidEmail('sin-arroba')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('trims surrounding whitespace', () => {
    expect(isValidEmail('  hola@unadm.mx ')).toBe(true);
  });
});

describe('mapAuthErrorMessage', () => {
  it('maps known auth error codes to friendly messages', () => {
    expect(mapAuthErrorMessage('auth/invalid-credential')).toContain('incorrectos');
    expect(mapAuthErrorMessage('auth/network-request-failed')).toContain('conexión');
  });

  it('guides the user when auth is not configured', () => {
    expect(mapAuthErrorMessage('auth/configuration-not-found')).toContain('Firebase Console');
  });

  it('maps registration-related codes', () => {
    expect(mapAuthErrorMessage('auth/email-already-in-use')).toContain('Ya existe');
    expect(mapAuthErrorMessage('auth/weak-password')).toContain('6 caracteres');
    expect(mapAuthErrorMessage('auth/unauthorized-domain')).toContain('autorizado');
  });

  it('falls back to a generic message for unknown codes', () => {
    expect(mapAuthErrorMessage('auth/whatever')).toBe('Ocurrió un error al autenticar.');
  });
});
