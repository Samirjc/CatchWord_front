import './styles/CriarAluno.css';
import { useState, useEffect } from 'react';

export function AlunoForm({ aluno = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    nomeAluno: '',
    emailAluno: '',
    cpfAluno: '',
    matriculaAluno: '',
  });

  useEffect(() => {
    if (aluno) {
      setFormData({
        nomeAluno: aluno.nomeAluno || '',
        emailAluno: aluno.emailAluno || '',
        cpfAluno: aluno.cpfAluno || '',
        matriculaAluno: aluno.matriculaAluno || '',
      });
    }
  }, [aluno]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.codigo || !formData.nomeDisciplina || !formData.professorSelecionado) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="aluno-form-overlay">
      <div className="aluno-form-container">
        <div className="aluno-form-header">
          <h2>{aluno ? 'Editar Aluno' : 'Criar Novo Aluno'}</h2>
          <button type="button" className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <div className="aluno-form">
          <div className="form-group">
            <label htmlFor="nome">Nome do Aluno *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nomeAluno}
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

          <label htmlFor="codigo">Código da Turma *</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              placeholder="Ex: TUR001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nomeDisciplina">Nome da Disciplina *</label>
            <input
              type="text"
              id="nomeDisciplina"
              name="nomeDisciplina"
              value={formData.nomeDisciplina}
              onChange={handleInputChange}
              placeholder="Ex: 6° Ano A"
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
  );
}