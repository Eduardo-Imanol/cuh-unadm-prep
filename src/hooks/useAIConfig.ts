import { useCallback, useState } from 'react';
import { generateQuestions } from '@/services/aiService';
import { useAIStore } from '@/store/aiStore';

export type AIConfigStatus =
  | 'idle'
  | 'testing'
  | 'saved'
  | 'error'
  | 'cleared';

export interface AIConfigState {
  draftKey: string;
  isKeyVisible: boolean;
  status: AIConfigStatus;
  message: string | null;
  isConfigured: boolean;
  setDraftKey: (value: string) => void;
  toggleVisibility: () => void;
  saveKey: () => void;
  testKey: () => Promise<void>;
  clearKey: () => void;
}

export function useAIConfig(): AIConfigState {
  const savedKey = useAIStore((state) => state.apiKey);
  const setApiKey = useAIStore((state) => state.setApiKey);
  const clearStoredKey = useAIStore((state) => state.clearApiKey);

  const [draftKey, setDraftKey] = useState(savedKey);
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
    setStatus('saved');
    setMessage('API key guardada de forma segura en esta sesión.');
  }, [draftKey, setApiKey]);

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
      const questions = await generateQuestions({ topic: 'Examen CUH', count: 1 }, key);
      if (questions.length > 0) {
        setApiKey(key);
        setStatus('saved');
        setMessage('Conexión exitosa: la IA respondió correctamente.');
      } else {
        setStatus('error');
        setMessage('La IA no devolvió preguntas. Revisa tu API key.');
      }
    } catch {
      setStatus('error');
      setMessage('No se pudo conectar. Verifica tu API key y tu conexión.');
    }
  }, [draftKey, setApiKey]);

  const clearKey = useCallback(() => {
    clearStoredKey();
    setDraftKey('');
    setStatus('cleared');
    setMessage('API key eliminada de esta sesión.');
  }, [clearStoredKey]);

  return {
    draftKey,
    isKeyVisible,
    status,
    message,
    isConfigured: savedKey.trim().length > 0,
    setDraftKey,
    toggleVisibility,
    saveKey,
    testKey,
    clearKey,
  };
}
