import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import { PageHeader } from '../../components/PageHeader/PageHeader.js';
import './styles/Login.css';
import { endpoints } from '../../services/API/api.js';

function FormInput({ 
  label, 
  icon: Icon, 
  error,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  ...inputProps 
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="input-wrapper">
        <Icon className="input-icon"/>
        <input
          {...inputProps}
          className={`field-input ${error ? 'input-error' : ''}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="toggle-password"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? (
              <EyeOff className="eye-icon" />
            ) : (
              <Eye className="eye-icon" />
            )}
          </button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
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

function ActionButtons({ onLogin, onForgotPassword, isLoading }) {
  return (
    <div className="button-group">
      <button 
        onClick={onLogin} 
        className="btn-submit"
        disabled={isLoading}
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
      <button
        onClick={onForgotPassword}
        className="forgot-password-buttom"
        type="button"
      >
        Esqueci minha senha
      </button>
    </div>
  );
}

function useAuth() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erros ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(endpoints.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.password
        })
      });      const data = await response.json();
      
      if (response.ok) {
        // Armazenar token ou dados do usuário
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        if (data.usuario) {
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
        }
        
        // Redirecionar para a página principal
        window.location.href = '/home';
      } else {
        setLoginError(data.error || 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error(error);
      setLoginError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Recuperação de senha para:', formData.email);
    // TODO: Implementar lógica de recuperação de senha
    alert('Funcionalidade de recuperação de senha em desenvolvimento.');
  };
  return {
    formData,
    errors,
    showPassword,
    isLoading,
    loginError,
    handleChange,
    setShowPassword,
    handleLogin,
    handleForgotPassword
  };
}

export default function LoginScreen() {
  const {
    formData,
    errors,
    showPassword,
    isLoading,
    loginError,
    handleChange,
    setShowPassword,
    handleLogin,
    handleForgotPassword
  } = useAuth();

  return (
    <div className="login-container">
      <Sidebar />

      <div className="login-main-content">
        <LoginCard>
          <PageHeader
            title="Bem-vindo!"
            subtitle="Entre com suas credenciais para continuar"
          />
          
          <div className="form-fields">
            {loginError && (
              <div className="login-error-banner">
                {loginError}
              </div>
            )}
            
            <FormInput
              label="Email"
              icon={Mail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              error={errors.email}
            />
            
            <FormInput
              label="Senha"
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              error={errors.password}
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <ActionButtons
              onLogin={handleLogin}
              onForgotPassword={handleForgotPassword}
              isLoading={isLoading}
            />
          </div>
        </LoginCard>
      </div>
    </div>
  );
}