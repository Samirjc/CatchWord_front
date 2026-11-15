import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redireciona para /login se não houver token no localStorage', () => {
    render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
          <Route path="/login" element={<div>Tela de Login</div>} />
          <Route
            path="/protegido"
            element={
              <PrivateRoute>
                <div>Conteúdo Secreto</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo Secreto')).not.toBeInTheDocument();
  });

  test('renderiza os filhos se houver authToken no localStorage', () => {
    localStorage.setItem('authToken', 'token_mock_valido');

    render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
          <Route path="/login" element={<div>Tela de Login</div>} />
          <Route
            path="/protegido"
            element={
              <PrivateRoute>
                <div>Conteúdo Secreto</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Conteúdo Secreto')).toBeInTheDocument();
    expect(screen.queryByText('Tela de Login')).not.toBeInTheDocument();
  });
});
