import { useState, useEffect } from 'react';
import { formatCPF } from '../../../services/Formatos/formatters';

export function AlunoForm({ aluno = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    matricula: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aluno) {
      setFormData({
        nome: aluno.nome || '',
        email: aluno.email || '',
        cpf: aluno.cpf || '',
        matricula: aluno.matricula || '',
      });
    }
  }, [aluno]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const formattedValue = name === 'cpf' ? formatCPF(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.cpf) {
      alert('Por favor, preencha nome e CPF');
      return;
    }

    // Email é obrigatório apenas na criação
    if (!aluno && !formData.email) {
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
          <h2>{aluno ? 'Editar Aluno' : 'Criar Novo Aluno'}</h2>
          <button type="button" className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="nome">Nome do Aluno *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Ex: Ricardo Abreu"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email do Aluno {!aluno && '*'}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ex: ricardo.abreu@estudante.escola.br"
              disabled={!!aluno}
            />
            {aluno && (
              <small className="form-hint">O email não pode ser alterado após a criação</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF do Aluno *</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="Ex: xxx.xxx.xxx-xx"
              maxLength={14}
            />
          </div>

          <div className="form-group">
            <label htmlFor="matricula">Matrícula do Aluno</label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleInputChange}
              placeholder="Ex: 2024001234"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="button" className="btn-save" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : (aluno ? 'Salvar Alterações' : 'Criar Aluno')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}