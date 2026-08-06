import { GoogleAuthProvider, signInWithPopup, type AuthError, type User } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { mapAuthErrorMessage } from '@/utils/auth';

export class AuthServiceError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'AuthServiceError';
    this.code = code;
  }
}

export async function signInWithGoogle(): Promise<User> {
  if (!auth) {
    throw new AuthServiceError(
      'auth/no-app',
      'Firebase no está configurado. Agrega las variables VITE_FIREBASE_* al .env.',
    );
  }

  const provider = new GoogleAuthProvider();

  try {
    const credentials = await signInWithPopup(auth, provider);
    return credentials.user;
  } catch (error) {
    const authError = error as AuthError;
    throw new AuthServiceError(authError.code, mapAuthErrorMessage(authError.code));
  }
}
