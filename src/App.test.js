import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Root', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renderiza a tela de login na rota inicial', () => {
    render(<App />);
    expect(screen.getByText(/Bem-vindo!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });
});
