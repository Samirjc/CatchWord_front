import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {Sidebar} from '../../components/Sidebar/Sidebar.js';
import {PageHeader} from '../../components/PageHeader/PageHeader.js';

import '../styles/pages.css';
import './styles/Login.css';

function EmailInput({ value, onChange }) {
  return (
    <div className="input-group">
      <label htmlFor="email" className="input-label">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        placeholder="seu@email.com"
        className="input-field"
      />
    </div>
  );
}

function PasswordInput({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group">
      <label htmlFor="password" className="input-label">
        Senha
      </label>
      <div className="password-wrapper">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="Digite a senha"
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

function LoginButton({ onClick, disabled = false }) {
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

function ForgotPasswordLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="forgot-password"
    >
      Esqueci minha senha
    </button>
  );
}

function LoginForm({ email, password, onEmailChange, onPasswordChange, onLogin, onForgotPassword }) {
  return (
    <div className="form-container">
      <EmailInput value={email} onChange={onEmailChange} />
      <PasswordInput value={password} onChange={onPasswordChange} />
      <LoginButton onClick={onLogin} />
      <ForgotPasswordLink onClick={onForgotPassword} />
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

function useAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = () => {
    console.log('Login:', { email, password });
    // Lógica de autenticação
  };

  const handleForgotPassword = () => {
    console.log('Esqueci minha senha');
    // Recuperação de senha
  };

  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    handleForgotPassword
  };
}


export default function LoginScreen() {
  const {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    handleForgotPassword
  } = useAuth();

  return (
      <div className="login-container">
        <Sidebar />
  
        <div className="login-main-content">
          <LoginCard>
            <PageHeader
              title = "Bem-vindo!"
              subtitle = "Entre com suas credenciais para continuar"
            />
            <LoginForm
              email={email}
              password={password}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onLogin={handleLogin}
              onForgotPassword={handleForgotPassword}
            />
          </LoginCard>
        </div>
      </div>
    );
}