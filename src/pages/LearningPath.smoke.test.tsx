import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db';
import LearningPath from '@/pages/LearningPath';
import { useAuthStore } from '@/store/authStore';
import type { User } from 'firebase/auth';

const mockUser = {
  uid: 'test-uid',
  displayName: 'Carlos',
  email: 'carlos@example.com',
} as User;

describe('LearningPath smoke render', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: mockUser, status: 'authenticated' });
  });

  afterEach(async () => {
    await db.topicMastery.clear();
  });

  it('renders the temario, summary and area cards', async () => {
    render(
      <MemoryRouter>
        <LearningPath />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Ruta de aprendizaje')).toBeInTheDocument();
    expect(screen.getByText(/Aviso/i)).toBeInTheDocument();
    expect(screen.getByText('Dominio general')).toBeInTheDocument();
    expect(screen.getAllByText('Español').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Matemáticas').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Informática').length).toBeGreaterThan(0);
    expect(screen.getByText('IV. Estrategia de estudio y logística del examen')).toBeInTheDocument();
    expect(screen.getByText('Sugerencia de plan de repaso')).toBeInTheDocument();
  });

  it('marks a subtema as dominado and persists it', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LearningPath />
      </MemoryRouter>,
    );

    const checkbox = (await screen.findAllByRole('checkbox'))[0];
    if (checkbox === undefined) {
      throw new Error('Expected at least one mastery checkbox');
    }
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await waitFor(async () => {
      const records = await db.topicMastery.toArray();
      expect(records).toHaveLength(1);
      expect(records[0]?.mastered).toBe(true);
    });

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
