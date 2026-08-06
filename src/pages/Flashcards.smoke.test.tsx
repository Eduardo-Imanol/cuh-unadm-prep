import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Flashcards from '@/pages/Flashcards';

describe('Flashcards module smoke render', () => {
  it('renders the deck and shows the first card', async () => {
    render(<Flashcards />);

    expect(screen.getByText('Flashcards')).toBeInTheDocument();
    expect(
      await screen.findByText('¿Cuál es la función principal de un texto argumentativo?'),
    ).toBeInTheDocument();
    expect(screen.getByText('308 tarjetas')).toBeInTheDocument();
  });

  it('flips the card to reveal the answer', async () => {
    const user = userEvent.setup();

    render(<Flashcards />);

    await user.click(
      await screen.findByRole('button', { name: 'Voltear tarjeta' }),
    );

    expect(screen.getByText('Respuesta')).toBeInTheDocument();
    expect(screen.getByText(/Persuadir al lector mediante razones y evidencias/)).toBeInTheDocument();
  });

  it('navigates to the next card with the Siguiente button', async () => {
    const user = userEvent.setup();

    render(<Flashcards />);

    await user.click(await screen.findByText('Siguiente'));

    expect(screen.getByText('2 / 308')).toBeInTheDocument();
  });

  it('filters the deck by category', async () => {
    const user = userEvent.setup();

    render(<Flashcards />);

    await user.click(await screen.findByText('Matemáticas'));

    expect(screen.queryByText(/\/ 308/)).not.toBeInTheDocument();
    expect(screen.getByText(/^1 \/ /)).toBeInTheDocument();
  });
});
