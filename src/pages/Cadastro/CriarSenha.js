import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import { PageHeader } from '../../components/PageHeader/PageHeader.js';
import './styles/CriarSenha.css';

function EmailInput({ value }) {
  return (
    <div className="input-group">
      <label htmlFor="email" className="input-label">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={value}
        placeholder="seu@email.com"
        className="input-field"
        readOnly
        disabled
      />
    </div>
  );
}

function PasswordInput({ value, onChange, id, label, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className="password-wrapper">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? (
            <EyeOff className="eye-icon" />
          ) : (
            <Eye className="eye-icon" />
          )}
        </button>
      </div>
    </div>
  );
}

function CreatePasswordButton({ onClick, disabled = false }) {
  return (
    <button 
      onClick={onClick} 
      className="login-button"
      disabled={disabled}
    >
      Entrar
    </button>
  );
}

function PasswordForm({ email, password, confirmPassword, onPasswordChange, onConfirmPasswordChange, onCreate}) {
  return (
    <div className="form-container">
      <EmailInput icon={Mail} value={email}/>
      <PasswordInput 
        id="password"
        label="Senha"
        icon={Lock}
        value={password} 
        onChange={onPasswordChange}
        placeholder="Digite sua senha" 
      />
      <PasswordInput 
        id="confirmPassword"
        label="Confirmar Senha"
        icon={Lock}
        value={confirmPassword} 
        onChange={onConfirmPasswordChange}
        placeholder="Confirme sua senha" 
      />
      <CreatePasswordButton onClick={onCreate} />
    </div>
  );
}

function LoginCard({ children }) {
  return (
    <div className="login-card-wrapper">
      <div className="login-card">
        {children}
      </div>
    </div>
  );
}

function usePasswordCreation(token) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Busca os dados do usuário usando o token
    const fetchUserData = async () => {
      if (!token) {
        setError('Token inválido');
        setLoading(false);
        return;
      }

      try {
        // Substitua pela URL da sua API
        const response = await fetch(`http://localhost:8080/api/usuarios/validar-token?token=${token}`);
        
        if (!response.ok) {
          throw new Error('Token inválido ou expirado');
        }

        const data = await response.json();
        setEmail(data.email || '');
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Erro ao buscar dados do usuário:', err);
      }
    };

    fetchUserData();
  }, [token]);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleCreatePassword = async () => {
    if (!password || !confirmPassword) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      // Substitua pela URL da sua API
      const response = await fetch('http://localhost:8080/api/usuarios/definir-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          senha: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar senha');
      }

      alert('Senha criada com sucesso!');
      // Redirecionar para login ou outra página
      // navigate('/login');
    } catch (err) {
      alert('Erro ao criar senha: ' + err.message);
      console.error('Erro ao criar senha:', err);
    }
  };

  return {
    email,
    password,
    confirmPassword,
    loading,
    error,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleCreatePassword,
  };
}

export default function PasswordScreen() {
  const location = useLocation();
  
  // Obtém o token da query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const {
    email,
    password,
    confirmPassword,
    loading,
    error,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleCreatePassword,
  } = usePasswordCreation(token);

  if (loading) {
    return (
      <div className="login-container">
        <Sidebar />
        <div className="login-main-content">
          <LoginCard>
            <PageHeader
              title="Carregando..."
              subtitle="Verificando seu convite"
            />
          </LoginCard>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-container">
        <Sidebar />
        <div className="login-main-content">
          <LoginCard>
            <PageHeader
              title="Erro"
              subtitle={error}
            />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Por favor, verifique se o link está correto ou solicite um novo convite.
            </p>
          </LoginCard>
        </div>
      </div>
    );
  }

  return (
      <div className="login-container">
        <Sidebar />
  
        <div className="login-main-content">
          <LoginCard>
            <PageHeader
              title = "Bem-vindo!"
              subtitle = "Defina sua senha"
            />
            <PasswordForm
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              onPasswordChange={handlePasswordChange}
              onConfirmPasswordChange={handleConfirmPasswordChange}
              onCreate={handleCreatePassword}
            />
          </LoginCard>
        </div>
      </div>
    );
}