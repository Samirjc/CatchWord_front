import { useState, useEffect } from 'react';
import { formatCPF } from '../../../services/Formatos/formatters';


// Componente principal do formulário
export function ProfessorForm({ professor = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    nomeProfessor: '',
    email: '',
    cpf: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (professor) {
      setFormData({
        nomeProfessor: professor.nome || '',
        email: professor.email || '',
        cpf: professor.cpf || '',
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

  const handleSubmit = async () => {
    if (!formData.nomeProfessor || !formData.cpf) {
      alert('Por favor, preencha nome e CPF');
      return;
    }

    // Email é obrigatório apenas na criação
    if (!professor && !formData.email) {
      alert('Por favor, preencha o email');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
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
            <label htmlFor="email">Email do Professor {!professor && '*'}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ex: maria.rosa@escola.br"
              disabled={!!professor}
            />
            {professor && (
              <small className="form-hint">O email não pode ser alterado após a criação</small>
            )}
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
              maxLength={14}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="button" className="btn-save" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : (professor ? 'Salvar Alterações' : 'Criar Novo Professor')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}