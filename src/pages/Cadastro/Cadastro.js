import { useState } from 'react';
import { Building2, Lock, Mail, MapPin, FileText, User } from 'lucide-react';
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
    </FormCard>
  );
}

function AddressDataSection({ formData, errors, onChange, onCEPChange }) {
  return (
    <FormCard icon={MapPin} title="Endereço da Escola">
      <FormInput
        label="CEP"
        icon={MapPin}
        type="text"
        name="cep"
        value={formData.cep}
        onChange={onCEPChange}
        placeholder="00000-000"
        maxLength={9}
        error={errors.cep}
      />
      
      <FormInput
        label="Cidade"
        icon={MapPin}
        type="text"
        name="cidade"
        value={formData.cidade}
        onChange={onChange}
        placeholder="Digite a cidade"
        error={errors.cidade}
      />
      
      <FormInput
        label="Bairro"
        icon={MapPin}
        type="text"
        name="bairro"
        value={formData.bairro}
        onChange={onChange}
        placeholder="Digite o bairro"
        error={errors.bairro}
      />
      
      <FormInput
        label="Logradouro"
        icon={MapPin}
        type="text"
        name="logradouro"
        value={formData.logradouro}
        onChange={onChange}
        placeholder="Rua, Avenida, etc."
        error={errors.logradouro}
      />
      
      <FormInput
        label="Número"
        icon={FileText}
        type="text"
        name="numero"
        value={formData.numero}
        onChange={onChange}
        placeholder="Número"
        error={errors.numero}
      />
      
      <FormInput
        label="Complemento"
        icon={FileText}
        type="text"
        name="complemento"
        value={formData.complemento}
        onChange={onChange}
        placeholder="Apartamento, Sala, etc. (opcional)"
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
    <FormCard icon={Lock} title="Dados do Coordenador">
      <FormInput
        label="Nome do Coordenador"
        icon={User}
        type="text"
        name="coordenadorNome"
        value={formData.coordenadorNome}
        onChange={onChange}
        placeholder="Digite o nome completo"
        error={errors.coordenadorNome}
      />
      
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
    cep: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    coordenadorNome: '',
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

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
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

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setFormData(prev => ({
      ...prev,
      cep: formatted
    }));
    if (errors.cep) {
      setErrors(prev => ({
        ...prev,
        cep: ''
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

    const cepNumbers = formData.cep.replace(/\D/g, '');
    if (!formData.cep) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (cepNumbers.length !== 8) {
      newErrors.cep = 'CEP deve conter 8 dígitos';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!formData.coordenadorNome.trim()) {
      newErrors.coordenadorNome = 'Nome do coordenador é obrigatório';
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

  const handleSubmit = async () => {
    if (validateForm()) {
      const requestBody = {
        escola: {
          nome: formData.schoolName,
          cnpj: formData.cnpj
        },
        endereco: {
          cep: formData.cep,
          cidade: formData.cidade,
          bairro: formData.bairro,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento
        },
        coordenador: {
          nome: formData.coordenadorNome,
          email: formData.email,
          senha: formData.password
        }
      };

      console.log('Dados a serem enviados:', JSON.stringify(requestBody, null, 2));
      
      try {
        const response = await fetch('http://localhost:3001/escola', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          const result = await response.json();
          alert('Cadastro realizado com sucesso!');
          console.log('Resposta do servidor:', result);
          // TODO: Redirecionar para outra página
          // window.location.href = '/login';
        } else {
          const errorData = await response.json();
          alert(`Erro ao cadastrar escola: ${errorData.error || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      cnpj: '',
      schoolName: '',
      cep: '',
      cidade: '',
      bairro: '',
      logradouro: '',
      numero: '',
      complemento: '',
      coordenadorNome: '',
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
    handleCEPChange,
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
    handleCEPChange,
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
  
              <AddressDataSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onCEPChange={handleCEPChange}
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