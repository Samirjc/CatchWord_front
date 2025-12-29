import { useState, useEffect } from 'react';
import { formatCPF } from '../../../services/Formatos/formatters';

export function AlunoForm({ aluno = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    codigo: '',
  });

  useEffect(() => {
    if (aluno) {
      setFormData({
        nome: aluno.name ||  '',
        email: aluno.email || '',
        cpf: aluno.cpf || '',
        codigo: aluno.code || '',
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

  const handleSubmit = () => {
    if (!formData.codigo || !formData.nome || !formData.email || !formData.cpf) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
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
            <label htmlFor="email">Email do Aluno *</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ex: ricardo.abreu@estudante.escola.br"
            />
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="matricula">Matricula do Aluno *</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              placeholder="Ex: ALUNO007"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="button" className="btn-save" onClick={handleSubmit}>
              {aluno ? 'Salvar Alterações' : 'Criar Aluno'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}