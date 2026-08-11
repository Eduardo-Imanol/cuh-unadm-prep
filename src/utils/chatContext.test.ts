import { describe, expect, it } from 'vitest';
import {
  buildChatSystemMessage,
  getPageContext,
  type PageContext,
} from './chatContext';

describe('getPageContext', () => {
  it('describes the dashboard', () => {
    const context = getPageContext('/');
    expect(context.title).toContain('Dashboard');
  });

  it('describes the exam catalog', () => {
    const context = getPageContext('/examenes');
    expect(context.title).toContain('Catálogo');
  });

  it('describes the flashcards page', () => {
    const context = getPageContext('/flashcards');
    expect(context.title).toContain('Flashcards');
  });

  it('describes the learning path page', () => {
    const context = getPageContext('/ruta-aprendizaje');
    expect(context.title).toContain('Ruta');
  });

  it('describes the AI config page', () => {
    const context = getPageContext('/config-ia');
    expect(context.title).toContain('Configuración');
  });

  it('includes the exam title for a known exam session', () => {
    const context = getPageContext('/examenes/examen-1');
    expect(context.title).toContain('Simulacro');
    expect(context.title).toContain('Examen 1');
  });

  it('falls back to a generic context for unknown routes', () => {
    const context = getPageContext('/ruta-desconocida');
    expect(context.title).toContain('Página');
  });
});

describe('buildChatSystemMessage', () => {
  it('embeds the page context into the system message', () => {
    const context: PageContext = {
      title: 'Simulacro: Examen 1',
      description: 'El estudiante está resolviendo un simulacro.',
    };
    const system = buildChatSystemMessage(context);
    expect(system).toContain('Tutor CUH');
    expect(system).toContain('Simulacro: Examen 1');
    expect(system).toContain('El estudiante está resolviendo un simulacro.');
  });

  it('embeds the current detail when present', () => {
    const context: PageContext = {
      title: 'Flashcards',
      description: 'El estudiante repasa tarjetas.',
      detail: 'Flashcard en pantalla "¿Qué es el CUH?" (categoría Español).',
    };
    const system = buildChatSystemMessage(context);
    expect(system).toContain('Flashcard en pantalla');
  });
});
