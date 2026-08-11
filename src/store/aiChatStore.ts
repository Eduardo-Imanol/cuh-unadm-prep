import { create } from 'zustand';
import { chatWithAI, type ChatMessage } from '@/services/aiService';
import { useAIStore } from '@/store/aiStore';
import { buildChatSystemMessage, type PageContext } from '@/utils/chatContext';

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError: boolean;
}

const MAX_CHAT_HISTORY = 10;

interface AIChatStore {
  isOpen: boolean;
  isLoading: boolean;
  entries: ChatEntry[];
  contextDetail: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  reset: () => void;
  setContextDetail: (detail: string | null) => void;
  sendMessage: (content: string, context: PageContext) => Promise<void>;
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function errorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}

export const useAIChatStore = create<AIChatStore>()((set, get) => ({
  isOpen: false,
  isLoading: false,
  entries: [],
  contextDetail: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  reset: () => set({ entries: [], isLoading: false }),
  setContextDetail: (detail) => set({ contextDetail: detail }),

  sendMessage: async (content, context) => {
    const text = content.trim();
    if (text.length === 0 || get().isLoading) {
      return;
    }

    const { apiKey, provider } = useAIStore.getState();
    const userEntry: ChatEntry = { id: createId(), role: 'user', content: text, isError: false };
    const entries = [...get().entries, userEntry];
    set({ entries, isLoading: true });

    const history: ChatMessage[] = entries
      .slice(-MAX_CHAT_HISTORY)
      .map((entry) => ({ role: entry.role, content: entry.content }));

    const messages: ChatMessage[] = [
      { role: 'system', content: buildChatSystemMessage(context) },
      ...history,
    ];

    try {
      const reply = await chatWithAI(messages, apiKey, provider);
      set({
        entries: [
          ...entries,
          { id: createId(), role: 'assistant', content: reply, isError: false },
        ],
        isLoading: false,
      });
    } catch (error) {
      set({
        entries: [
          ...entries,
          { id: createId(), role: 'assistant', content: errorMessage(error), isError: true },
        ],
        isLoading: false,
      });
    }
  },
}));
