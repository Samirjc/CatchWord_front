import { useState } from 'react';
import { Building2, Lock, Mail, MapPin, FileText } from 'lucide-react';
import './Cadastro.css';

export function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <span className="logo-emoji">🔍</span>
      </div>
      <h1 className="logo-text">
        Caça<span className="logo-highlight">Palavras</span>
      </h1>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="sidebar">
      <Logo />
    </div>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="page-title">{title}</h2>
      <p className="page-subtitle">{subtitle}</p>
    </>
  );
}

function FormInput({ 
  label, 
  icon: Icon, 
  error, 
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
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

function CardHeader({ icon: Icon, title }) {
  return (
    <div className="card-header">
      <Icon className="header-icon" />
      <h3 className="card-title">{title}</h3>
    </div>
  );
}

function FormCard({ icon, title, children }) {
  return (
    <div className="form-card">
      <CardHeader icon={icon} title={title} />
      <div className="form-fields">
        {children}
      </div>
    </div>
  );
}

function SchoolDataSection({ formData, errors, onCNPJChange, onChange }) {
  return (
    <FormCard icon={Building2} title="Dados da Escola">
      <FormInput
        label="CNPJ da Escola"
        icon={FileText}
        type="text"
        name="cnpj"
        value={formData.cnpj}
        onChange={onCNPJChange}
        placeholder="00.000.000/0000-00"
        maxLength={18}
        error={errors.cnpj}
      />
      
      <FormInput
        label="Nome da Escola"
        icon={Building2}
        type="text"
        name="schoolName"
        value={formData.schoolName}
        onChange={onChange}
        placeholder="Digite o nome completo da escola"
        error={errors.schoolName}
      />
      
      <FormInput
        label="Endereço da Escola"
        icon={MapPin}
        type="text"
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Rua, número, bairro, cidade - UF"
        error={errors.address}
      />
    </FormCard>
  );
}

function ActionButtons({ onCancel, onSubmit }) {
  return (
    <div className="button-group">
      <button onClick={onCancel} className="btn-cancel">
        Cancelar
      </button>
      <button onClick={onSubmit} className="btn-submit">
        Cadastrar Escola
      </button>
    </div>
  );
}

function AccessDataSection({ formData, errors, onChange }) {
  return (
    <FormCard icon={Lock} title="Dados de Acesso">
      <FormInput
        label="Email"
        icon={Mail}
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="email@escola.com.br"
        error={errors.email}
      />
      
      <FormInput
        label="Senha"
        icon={Lock}
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        placeholder="Mínimo 6 caracteres"
        error={errors.password}
      />
      
      <FormInput
        label="Confirmar Senha"
        icon={Lock}
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onChange}
        placeholder="Digite a senha novamente"
        error={errors.confirmPassword}
      />
    </FormCard>
  );
}

function useSchoolRegistration() {
  const [formData, setFormData] = useState({
    cnpj: '',
    schoolName: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

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

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({
      ...prev,
      cnpj: formatted
    }));
    if (errors.cnpj) {
      setErrors(prev => ({
        ...prev,
        cnpj: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    if (!formData.cnpj) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (cnpjNumbers.length !== 14) {
      newErrors.cnpj = 'CNPJ deve conter 14 dígitos';
    }

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'Nome da escola é obrigatório';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        // Mudança de página
      alert('Cadastro realizado com sucesso!\n\nDados da escola:\n' +
        `CNPJ: ${formData.cnpj}\n` +
        `Nome: ${formData.schoolName}\n` +
        `Endereço: ${formData.address}\n` +
        `Email: ${formData.email}`
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      cnpj: '',
      schoolName: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    handleCNPJChange,
    handleSubmit,
    handleCancel
  };
}

export default function SchoolRegistration() {
    const {
    formData,
    errors,
    handleChange,
    handleCNPJChange,
    handleSubmit,
    handleCancel
  } = useSchoolRegistration();

  return (
      <div className="registration-container">
        <Sidebar />
        
        <div className="main-content">
          <div className="content-wrapper">
            <PageHeader 
              title="Cadastro de Escola"
              subtitle="Preencha os dados abaixo para cadastrar sua escola"
            />
  
            <div className="form-sections">
              <SchoolDataSection
                formData={formData}
                errors={errors}
                onCNPJChange={handleCNPJChange}
                onChange={handleChange}
              />
  
              <AccessDataSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
  
              <ActionButtons
                onCancel={handleCancel}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    );
}