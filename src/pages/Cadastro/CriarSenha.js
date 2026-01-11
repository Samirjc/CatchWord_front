import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import { PageHeader } from '../../components/PageHeader/PageHeader.js';
import './styles/CriarSenha.css';

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
      className="pass-button"
      disabled={disabled}
    >
      Entrar
    </button>
  );
}

function PasswordForm({ password, confirmPassword, onPasswordChange, onConfirmPasswordChange, onCreate}) {
  return (
    <div className="form-container">
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
    <div className="pass-card-wrapper">
      <div className="pass-card">
        {children}
      </div>
    </div>
  );
}

function usePasswordCreation(token) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    password,
    confirmPassword,
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
      <div className="pass-container">
        <Sidebar />
        <div className="pass-main-content">
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
      <div className="pass-container">
        <Sidebar />
        <div className="pass-main-content">
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
      <div className="pass-container">
        <Sidebar />
  
        <div className="pass-main-content">
          <LoginCard>
            <PageHeader
              title = "Bem-vindo!"
              subtitle = "Defina sua senha"
            />
            <PasswordForm
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