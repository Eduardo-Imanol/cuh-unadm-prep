import { getAuth, browserLocalPersistence, setPersistence, type Auth } from 'firebase/auth';
import { initializeApp, type FirebaseApp } from 'firebase/app';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
}

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function createFirebaseApp(): FirebaseApp | null {
  const { apiKey, authDomain, projectId, appId } = envConfig;
  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }
  return initializeApp({ apiKey, authDomain, projectId, appId } satisfies FirebaseConfig);
}

const app = createFirebaseApp();

export const auth: Auth | null = app ? getAuth(app) : null;

export async function configureAuthPersistence(): Promise<void> {
  if (!auth) {
    return;
  }
  await setPersistence(auth, browserLocalPersistence);
}

if (auth) {
  void configureAuthPersistence();
}

export function isFirebaseConfigured(): boolean {
  return app !== null;
}
