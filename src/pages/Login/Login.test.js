import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginScreen from './Login';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <LoginScreen />
    </BrowserRouter>
  );
};

describe('LoginScreen Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renderiza os campos de email, senha e botão entrar', () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite sua senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  test('exibe erros de validação quando campos estão vazios ao submeter', () => {
    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
  });

  test('exibe erro de validação para formato de email inválido', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    fireEvent.change(emailInput, { target: { name: 'email', value: 'emailinvalido' } });

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  test('exibe erro de validação para senha com menos de 6 caracteres', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);

    fireEvent.change(emailInput, { target: { name: 'email', value: 'teste@escola.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(screen.getByText('Senha deve ter no mínimo 6 caracteres')).toBeInTheDocument();
  });

  test('alterna visibilidade da senha ao clicar no botão de olho', () => {
    renderLogin();

    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);
    const toggleButton = screen.getByRole('button', { name: /Mostrar senha/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('exibe banner de erro quando a API retorna erro no login', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Credenciais inválidas' }),
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/Digite sua senha/i);

    fireEvent.change(emailInput, { target: { name: 'email', value: 'teste@escola.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'senha123' } });

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });
});
