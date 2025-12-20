import React, { useState } from 'react';
import { Building2, Mail, Lock, MapPin, FileText } from 'lucide-react';
import './Cadastro.css';

export default function SchoolRegistration() {
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

  return (
    <div className="registration-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <span className="logo-emoji">🔍</span>
          </div>
          <h1 className="logo-text">
            Caça<span className="logo-highlight">Palavras</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          <h2 className="page-title">Cadastro de Escola</h2>
          <p className="page-subtitle">Preencha os dados abaixo para cadastrar sua escola</p>

          <div className="form-sections">
            {/* Dados da Escola */}
            <div className="form-card">
              <div className="card-header">
                <Building2 className="header-icon" size={24} />
                <h3 className="card-title">Dados da Escola</h3>
              </div>

              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">CNPJ da Escola</label>
                  <div className="input-wrapper">
                    <FileText className="input-icon" size={20} />
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleCNPJChange}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className={`field-input ${errors.cnpj ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.cnpj && <p className="error-message">{errors.cnpj}</p>}
                </div>

                <div className="field-group">
                  <label className="field-label">Nome da Escola</label>
                  <div className="input-wrapper">
                    <Building2 className="input-icon" size={20} />
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      placeholder="Digite o nome completo da escola"
                      className={`field-input ${errors.schoolName ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.schoolName && <p className="error-message">{errors.schoolName}</p>}
                </div>

                <div className="field-group">
                  <label className="field-label">Endereço da Escola</label>
                  <div className="input-wrapper">
                    <MapPin className="input-icon" size={20} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro, cidade - UF"
                      className={`field-input ${errors.address ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.address && <p className="error-message">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Dados de Acesso */}
            <div className="form-card">
              <div className="card-header">
                <Lock className="header-icon" size={24} />
                <h3 className="card-title">Dados de Acesso</h3>
              </div>

              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Email</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@escola.com.br"
                      className={`field-input ${errors.email ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="field-group">
                  <label className="field-label">Senha</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      className={`field-input ${errors.password ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                <div className="field-group">
                  <label className="field-label">Confirmar Senha</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Digite a senha novamente"
                      className={`field-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="button-group">
              <button onClick={handleCancel} className="btn-cancel">
                Cancelar
              </button>
              <button onClick={handleSubmit} className="btn-submit">
                Cadastrar Escola
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}