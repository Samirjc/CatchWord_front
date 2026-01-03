import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import { PageHeader } from '../../components/PageHeader/PageHeader.js';
import './styles/Login.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
    if (validateForm()) {
      setIsLoading(true);
      const requestBody = {
        email: formData.email,
        senha: formData.password
      };

      console.log('Dados de login:', JSON.stringify(requestBody, null, 2));
      
      try {
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          const result = await response.json();
          alert('Login realizado com sucesso!');
          console.log('Resposta do servidor:', result);
          
          // Armazenar token ou dados do usuário
          if (result.token) {
            localStorage.setItem('authToken', result.token);
          }
          if (result.usuario) {
            localStorage.setItem('usuario', JSON.stringify(result.usuario));
          }
          
          // TODO: Redirecionar para a página principal
          // window.location.href = '/home';
        } else {
          const errorData = await response.json();
          alert(`Erro ao fazer login: ${errorData.error || 'Credenciais inválidas'}`);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
      } finally {
        setIsLoading(false);
      }
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