import { useState } from 'react';
import { Building2, Lock, Mail, MapPin, FileText, User, ChevronLeft, ChevronRight, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import './styles/Cadastro.css';

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

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="step-indicator">
      {[...Array(totalSteps)].map((_, index) => (
        <div 
          key={index} 
          className={`step-dot ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
        />
      ))}
    </div>
  );
}

function CadastroCard({ children }) {
  return (
    <div className="cadastro-card-wrapper">
      <div className="cadastro-card">
        {children}
      </div>
    </div>
  );
}

// Step 1: Dados da Escola
function Step1({ formData, errors, onCNPJChange, onChange }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <Building2 size={24} className="step-icon" />
        <h3 className="step-title">Dados da Escola</h3>
      </div>
      
      <div className="form-fields">
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
      </div>
    </div>
  );
}

// Step 2: Endereço
function Step2({ formData, errors, onChange, onCEPChange }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <MapPin size={24} className="step-icon" />
        <h3 className="step-title">Endereço da Escola</h3>
      </div>
      
      <div className="form-fields">
        <div className="form-row">
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
        </div>
        
        <div className="form-row">
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
        </div>
        
        <div className="form-row">
          <FormInput
            label="Número"
            icon={MapPin}
            type="text"
            name="numero"
            value={formData.numero}
            onChange={onChange}
            placeholder="Número"
            error={errors.numero}
          />
          
          <FormInput
            label="Complemento (opcional)"
            icon={MapPin}
            type="text"
            name="complemento"
            value={formData.complemento}
            onChange={onChange}
            placeholder="Apt, Sala, etc."
          />
        </div>
      </div>
    </div>
  );
}

// Step 3: Dados do Coordenador
function Step3({ formData, errors, onChange, onCPFChange }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <User size={24} className="step-icon" />
        <h3 className="step-title">Dados do Coordenador</h3>
      </div>
      
      <div className="form-fields">
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
          label="CPF"
          icon={IdCard}
          type="text"
          name="coordenadorCpf"
          value={formData.coordenadorCpf}
          onChange={onCPFChange}
          placeholder="000.000.000-00"
          maxLength={14}
          error={errors.coordenadorCpf}
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
      </div>
    </div>
  );
}

function NavigationButtons({ currentStep, totalSteps, onPrev, onNext, onSubmit, isLoading }) {
  return (
    <div className="navigation-buttons">
      {currentStep > 1 ? (
        <button onClick={onPrev} className="btn-nav btn-prev">
          <ChevronLeft size={20} />
          Voltar
        </button>
      ) : (
        <div></div>
      )}
      
      {currentStep < totalSteps ? (
        <button onClick={onNext} className="btn-nav btn-next">
          Continuar
          <ChevronRight size={20} />
        </button>
      ) : (
        <button onClick={onSubmit} className="btn-nav btn-submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar Escola'}
        </button>
      )}
    </div>
  );
}

function useSchoolRegistration() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
    coordenadorCpf: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 3;

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

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
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
      setErrors(prev => ({ ...prev, cnpj: '' }));
    }
  };

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setFormData(prev => ({
      ...prev,
      cep: formatted
    }));
    if (errors.cep) {
      setErrors(prev => ({ ...prev, cep: '' }));
    }
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      coordenadorCpf: formatted
    }));
    if (errors.coordenadorCpf) {
      setErrors(prev => ({ ...prev, coordenadorCpf: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
      if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (cnpjNumbers.length !== 14) {
        newErrors.cnpj = 'CNPJ deve conter 14 dígitos';
      }
      if (!formData.schoolName.trim()) {
        newErrors.schoolName = 'Nome da escola é obrigatório';
      }
    }

    if (step === 2) {
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
    }

    if (step === 3) {
      if (!formData.coordenadorNome.trim()) {
        newErrors.coordenadorNome = 'Nome do coordenador é obrigatório';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        newErrors.email = 'Email é obrigatório';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      const cpfNumbers = formData.coordenadorCpf.replace(/\D/g, '');
      if (!formData.coordenadorCpf) {
        newErrors.coordenadorCpf = 'CPF é obrigatório';
      } else if (cpfNumbers.length !== 11) {
        newErrors.coordenadorCpf = 'CPF deve conter 11 dígitos';
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    
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
        cpf: formData.coordenadorCpf,
        senha: formData.password
      }
    };
    
    try {
      const response = await fetch('http://localhost:3001/escola', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        navigate('/sucesso');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Erro ao cadastrar escola' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrors({ submit: 'Erro ao conectar com o servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    currentStep,
    totalSteps,
    isLoading,
    handleChange,
    handleCNPJChange,
    handleCEPChange,
    handleCPFChange,
    handleNext,
    handlePrev,
    handleSubmit
  };
}

export default function SchoolRegistration() {
  const {
    formData,
    errors,
    currentStep,
    totalSteps,
    isLoading,
    handleChange,
    handleCNPJChange,
    handleCEPChange,
    handleCPFChange,
    handleNext,
    handlePrev,
    handleSubmit
  } = useSchoolRegistration();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            errors={errors}
            onCNPJChange={handleCNPJChange}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onCEPChange={handleCEPChange}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onCPFChange={handleCPFChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-main-content">
        <CadastroCard>
          <PageHeader
            title="Cadastro de Escola"
            subtitle={`Passo ${currentStep} de ${totalSteps}`}
          />
          
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          
          {errors.submit && (
            <div className="submit-error-banner">
              {errors.submit}
            </div>
          )}
          
          {renderStep()}
          
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrev={handlePrev}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CadastroCard>
      </div>
    </div>
  );
}
