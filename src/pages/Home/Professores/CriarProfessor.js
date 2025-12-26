import './styles/CriarProfessor.css';

import { useState, useEffect } from 'react';
import './styles/CriarProfessor.css';

// Componente principal do formulário
export function ProfessorForm({ professor = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    nomeProfessor: '',
    email: '',
    cpf: '',
  });

  useEffect(() => {
    if (professor) {
      setFormData({
        nomeProfessor: professor.nomeProfessor || '',
        email: professor.email || '',
        cpf: professor.cpf || '',
      });
    }
  }, [professor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.nomeProfessor || !formData.email || !formData.cpf) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="professor-form-overlay">
      <div className="professor-form-container">
        <div className="professor-form-header">
          <h2>{professor ? 'Editar Professor' : 'Criar Novo Professor'}</h2>
          <button type="button" className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <div className="professor-form">
          <div className="form-group">
            <label htmlFor="Nome">Nome do Professor *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nomeProfessor}
              onChange={handleInputChange}
              placeholder="Ex: Maria Rosa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email do Professor *</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ex: maria.rosa@escola.br"
            />
          </div>

          <div className="form-group">
            <label>CPF do Professor *</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder='Ex: xxx.xxx.xxx-xx'
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="button" className="btn-save" onClick={handleSubmit}>
              {professor ? 'Salvar Alterações' : 'Criar Novo Professor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}