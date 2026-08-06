import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from 'firebase/auth';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db';
import ExamSession from '@/pages/ExamSession';
import Exams from '@/pages/Exams';
import { useAuthStore } from '@/store/authStore';

const mockUser = {
  uid: 'test-uid',
  displayName: 'Carlos',
  email: 'carlos@example.com',
} as User;

describe('Exams module smoke render', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(async () => {
    window.sessionStorage.clear();
    await db.examAttempts.clear();
    await db.topicMastery.clear();
  });

  it('renders the exam selection interface without crashing', async () => {
    useAuthStore.setState({ user: mockUser, status: 'authenticated' });

    render(
      <MemoryRouter>
        <Exams />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Simulador de exámenes')).toBeInTheDocument();
    expect(screen.getByText('Examen 1 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getByText('Examen 3 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getByText('Examen 4 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getAllByText('Iniciar examen')).toHaveLength(3);
    expect(screen.getAllByText('Próximamente')).toHaveLength(1);
    expect(screen.getByText('Elige tu examen')).toBeInTheDocument();
  });

  it('shows the intro screen for a playable exam and runs the full flow', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/examenes/examen-3']}>
        <Routes>
          <Route path="/examenes/:examId" element={<ExamSession />} />
          <Route path="/examenes" element={<Exams />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Examen 3 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getByText('Comenzar examen')).toBeInTheDocument();

    await user.click(screen.getByText('Comenzar examen'));
    expect(screen.getByText('Pregunta 1 de 100')).toBeInTheDocument();

    await user.click(screen.getAllByRole('radio')[2] ?? screen.getByRole('radio'));
    expect(screen.getByText('1/100 respondidas')).toBeInTheDocument();

    await user.click(screen.getByText('Finalizar examen'));
    await user.click(await screen.findByText('Finalizar ahora'));

    expect(await screen.findByText('Simulacro completado')).toBeInTheDocument();
    expect(screen.getByText(/1 acierto de 100 reactivos/)).toBeInTheDocument();
    expect(screen.getByText('Revisión de reactivos')).toBeInTheDocument();

    await waitFor(async () => {
      const attempts = await db.examAttempts.toArray();
      expect(attempts).toHaveLength(1);
      expect(attempts[0]?.examId).toBe('examen-3');
      expect(attempts[0]?.score).toBe(1);
    });
  });

  it('shows the intro screen for Examen 2 with its own question bank', async () => {
    render(
      <MemoryRouter initialEntries={['/examenes/examen-2']}>
        <Routes>
          <Route path="/examenes/:examId" element={<ExamSession />} />
          <Route path="/examenes" element={<Exams />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Examen 2 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getByText('Comenzar examen')).toBeInTheDocument();
    expect(screen.getByText('100 preguntas')).toBeInTheDocument();
    expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    expect(screen.getByText('Informática')).toBeInTheDocument();
    expect(screen.getByText('Ciencias Sociales')).toBeInTheDocument();
    expect(screen.getByText('Ciencias Experimentales')).toBeInTheDocument();
  });

  it('shows the maintenance notice for Examen 1', async () => {
    render(
      <MemoryRouter initialEntries={['/examenes/examen-1']}>
        <Routes>
          <Route path="/examenes/:examId" element={<ExamSession />} />
          <Route path="/examenes" element={<Exams />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Examen 1 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getByText('Examen en mantenimiento')).toBeInTheDocument();
  });

  it('shows the intro screen for Examen 3 with its own question bank and non-official notice', async () => {
    render(
      <MemoryRouter initialEntries={['/examenes/examen-3']}>
        <Routes>
          <Route path="/examenes/:examId" element={<ExamSession />} />
          <Route path="/examenes" element={<Exams />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Examen 3 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getByText('Comenzar examen')).toBeInTheDocument();
    expect(screen.getByText('100 preguntas')).toBeInTheDocument();
    expect(screen.getByText('Práctica no oficial')).toBeInTheDocument();
    expect(screen.getByText(/no representa, sustituye ni garantiza/)).toBeInTheDocument();
  });

  it('shows the intro screen for Examen 4 with its own question bank and non-official notice', async () => {
    render(
      <MemoryRouter initialEntries={['/examenes/examen-4']}>
        <Routes>
          <Route path="/examenes/:examId" element={<ExamSession />} />
          <Route path="/examenes" element={<Exams />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Examen 4 · Simulador de Admisión UnADM')).toBeInTheDocument();
    expect(screen.getByText('Comenzar examen')).toBeInTheDocument();
    expect(screen.getByText('108 preguntas')).toBeInTheDocument();
    expect(screen.getByText('Práctica no oficial')).toBeInTheDocument();
    expect(screen.getByText(/no representa, sustituye ni garantiza/)).toBeInTheDocument();
    expect(screen.getByText('Ciencias Experimentales')).toBeInTheDocument();
    expect(screen.getByText('Ciencias Sociales')).toBeInTheDocument();
    expect(screen.getByText('Ambientes Virtuales')).toBeInTheDocument();
  });

  it('redirects unknown exams back to the list', async () => {
    render(
      <MemoryRouter initialEntries={['/examenes/inexistente']}>
        <Routes>
          <Route path="/examenes/:examId" element={<ExamSession />} />
          <Route path="/examenes" element={<Exams />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Simulador de exámenes')).toBeInTheDocument();
  });
});
