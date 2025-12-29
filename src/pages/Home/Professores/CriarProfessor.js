import { useState, useEffect } from 'react';
import { formatCPF } from '../../../services/Formatos/formatters';


// Componente principal do formulário
export function ProfessorForm({ professor = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    nomeProfessor: '',
    email: '',
    cpf: '',
    code: '',
  });

  useEffect(() => {
    if (professor) {
      setFormData({
        nomeProfessor: professor.name || '',
        email: professor.email || '',
        cpf: professor.cpf || '',
        code: professor.code || '',
      });
    }
  }, [professor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Aplica formatação apenas para o campo CPF
    const formattedValue = name === 'cpf' ? formatCPF(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = () => {
    if (!formData.nomeProfessor || !formData.email || !formData.cpf || !formData.code) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{professor ? 'Editar Professor' : 'Criar Novo Professor'}</h2>
          <button type="button" className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="nome">Nome do Professor *</label>
            <input
              type="text"
              id="nomeProfessor"
              name="nomeProfessor"
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

          <div className="form-group">
            <label>Código do Professor *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder='Ex: PROF000'
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