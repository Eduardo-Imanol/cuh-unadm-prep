import type { LucideIcon } from 'lucide-react';
import { BookOpen, ClipboardCheck, Home, Layers, Sparkles } from 'lucide-react';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavigationItem[] = [
  { label: 'Inicio', path: '/', icon: Home },
  { label: 'Simulador de exámenes', path: '/examenes', icon: ClipboardCheck },
  { label: 'Flashcards', path: '/flashcards', icon: Layers },
  { label: 'Ruta de aprendizaje', path: '/ruta-aprendizaje', icon: BookOpen },
];

export const AI_CONFIG_ITEM: NavigationItem = {
  label: 'Configurar IA',
  path: '/config-ia',
  icon: Sparkles,
};
