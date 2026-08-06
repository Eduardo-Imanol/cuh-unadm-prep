import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { addExamAttempt, db } from '@/db';
import Dashboard from '@/pages/Dashboard';
import { useAIStore } from '@/store/aiStore';
import { useAuthStore } from '@/store/authStore';
import type { User } from 'firebase/auth';

const mockUser = {
  uid: 'test-uid',
  displayName: 'Carlos',
  email: 'carlos@example.com',
} as User;

describe('Dashboard smoke render', () => {
  afterEach(async () => {
    await db.progress.clear();
    await db.topicMastery.clear();
    await db.examAttempts.clear();
  });

  it('renders the dashboard UI without crashing', async () => {
    useAuthStore.setState({ user: mockUser, status: 'authenticated' });
    useAIStore.setState({ apiKey: '' });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/¡Hola, Carlos!/)).toBeInTheDocument();
    expect(screen.getByText(/Avance Global/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu Siguiente Paso/i)).toBeInTheDocument();
  });

  it('links exam attempts into the probability, subjects and next step', async () => {
    useAuthStore.setState({ user: mockUser, status: 'authenticated' });
    useAIStore.setState({ apiKey: '' });

    await addExamAttempt({
      examId: 'examen-2',
      answers: {},
      score: 15,
      breakdown: [
        { category: 'Español', correct: 3, total: 20 },
        { category: 'Pensamiento Matemático', correct: 4, total: 20 },
        { category: 'Habilidades Digitales', correct: 8, total: 20 },
      ],
      timeSpentSeconds: 600,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/¡Hola, Carlos!/)).toBeInTheDocument();

    expect(await screen.findByText(/1\/4 exámenes completados/i)).toBeInTheDocument();
    expect(screen.getByText(/Siguiente simulacro pendiente/i)).toBeInTheDocument();
    expect(screen.getByText('Examen 3 · Simulador de Admisión UnADM')).toBeInTheDocument();

    expect(screen.getAllByText(/Mejor simulacro:/)).toHaveLength(3);
    expect(screen.getByText(/Mejor simulacro: 15%/)).toBeInTheDocument();
    expect(screen.getByText(/Mejor simulacro: 20%/)).toBeInTheDocument();
    expect(screen.getByText(/Mejor simulacro: 40%/)).toBeInTheDocument();
    expect(screen.getAllByText('Prioridad de estudio')).toHaveLength(3);
  });
});
