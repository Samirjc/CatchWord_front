import { Navigate } from 'react-router-dom';

/**
 * Componente que protege rotas privadas.
 * Redireciona para /login se o usuário não estiver autenticado.
 */
export function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default PrivateRoute;
