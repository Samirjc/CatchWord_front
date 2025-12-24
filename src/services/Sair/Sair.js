import { useNavigate } from 'react-router-dom';

export function useSair() {
    const navigate = useNavigate();

    const sair = () => {
        // Limpa dados de autenticação
        localStorage.clear();
        sessionStorage.clear();
        
        // Navega para a página de login
        navigate('/login');
    };

    return sair;
}