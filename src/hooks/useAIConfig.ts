import { useCallback, useState } from 'react';
import { generateQuestions, type AIProvider } from '@/services/aiService';
import { useAIStore } from '@/store/aiStore';

export type AIConfigStatus =
  | 'idle'
  | 'testing'
  | 'saved'
  | 'error'
  | 'cleared';

export interface AIConfigState {
  draftKey: string;
  provider: AIProvider;
  isKeyVisible: boolean;
  status: AIConfigStatus;
  message: string | null;
  isConfigured: boolean;
  setDraftKey: (value: string) => void;
  setProvider: (value: AIProvider) => void;
  toggleVisibility: () => void;
  saveKey: () => void;
  testKey: () => Promise<void>;
  clearKey: () => void;
}

export function useAIConfig(): AIConfigState {
  const savedKey = useAIStore((state) => state.apiKey);
  const savedProvider = useAIStore((state) => state.provider);
  const setApiKey = useAIStore((state) => state.setApiKey);
  const setStoredProvider = useAIStore((state) => state.setProvider);
  const clearStoredKey = useAIStore((state) => state.clearApiKey);

  const [draftKey, setDraftKey] = useState(savedKey);
  const [provider, setProvider] = useState<AIProvider>(savedProvider);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [status, setStatus] = useState<AIConfigStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const toggleVisibility = useCallback(() => setIsKeyVisible((visible) => !visible), []);

  const saveKey = useCallback(() => {
    const key = draftKey.trim();
    if (key.length === 0) {
      setStatus('error');
      setMessage('Pega tu API key antes de guardar.');
      return;
    }
    setApiKey(key);
    setStoredProvider(provider);
    setStatus('saved');
    setMessage('API key guardada de forma segura en esta sesión.');
  }, [draftKey, provider, setApiKey, setStoredProvider]);

  const testKey = useCallback(async () => {
    const key = draftKey.trim();
    if (key.length === 0) {
      setStatus('error');
      setMessage('Ingresa una API key para probar la conexión.');
      return;
    }

    setStatus('testing');
    setMessage(null);

    try {
      const questions = await generateQuestions({ topic: 'Examen CUH', count: 1 }, key, provider);
      if (questions.length > 0) {
        setApiKey(key);
        setStoredProvider(provider);
        setStatus('saved');
        setMessage('Conexión exitosa: la IA respondió correctamente.');
      } else {
        setStatus('error');
        setMessage('La IA no devolvió preguntas. Revisa tu API key.');
      }
    } catch (error) {
      setStatus('error');
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: unknown }).message
          : undefined;
      setMessage(
        typeof message === 'string' && message.trim().length > 0
          ? message
          : 'No se pudo conectar. Verifica tu API key y tu conexión.',
      );
    }
  }, [draftKey, provider, setApiKey, setStoredProvider]);

  const clearKey = useCallback(() => {
    clearStoredKey();
    setDraftKey('');
    setStatus('cleared');
    setMessage('API key eliminada de esta sesión.');
  }, [clearStoredKey]);

  return {
    draftKey,
    provider,
    isKeyVisible,
    status,
    message,
    isConfigured: savedKey.trim().length > 0,
    setDraftKey,
    setProvider,
    toggleVisibility,
    saveKey,
    testKey,
    clearKey,
  };
}
