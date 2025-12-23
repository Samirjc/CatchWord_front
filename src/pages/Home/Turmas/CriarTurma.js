import { useState, useEffect } from 'react';
import './styles/CriarTurma.css';

const alunosDisponiveis = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Santos' },
    { id: 3, nome: 'Pedro Oliveira' },
    { id: 4, nome: 'Ana Costa' },
    { id: 5, nome: 'Lucas Pereira' }
];

const professoresDisponiveis = [
    { id: 1, nome: 'Prof. Carlos Mendes' },
    { id: 2, nome: 'Prof. Paula Rocha' },
    { id: 3, nome: 'Prof. Roberto Lima' }
];

// Componente para seleção de professor
function ProfessorSelector({ professorSelecionado, onSelecionarProfessor, onRemoverProfessor }) {
  const [mostrarLista, setMostrarLista] = useState(false);

  const handleSelecionar = (professor) => {
    onSelecionarProfessor(professor);
    setMostrarLista(false);
  };

  return (
    <div className="selector-container">
      {professorSelecionado ? (
        <div className="selected-item">
          <span>{professorSelecionado.nome}</span>
          <button
            type="button"
            onClick={onRemoverProfessor}
            className="btn-remove-small"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-add"
          onClick={() => setMostrarLista(!mostrarLista)}
        >
          + Selecionar Professor
        </button>
      )}

      {mostrarLista && (
        <div className="dropdown-list">
          {professoresDisponiveis.map(prof => (
            <div
              key={prof.id}
              className="dropdown-item"
              onClick={() => handleSelecionar(prof)}
            >
              {prof.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para seleção de alunos
function AlunosSelector({ alunosSelecionados, onToggleAluno, onRemoverAluno }) {
  const [mostrarLista, setMostrarLista] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn-add"
        onClick={() => setMostrarLista(!mostrarLista)}
      >
        + Adicionar Alunos
      </button>

      {mostrarLista && (
        <div className="dropdown-list" style={{ position: 'relative', zIndex: 1000 }}>
          {alunosDisponiveis.map(aluno => {
            const jaSelecionado = alunosSelecionados.find(a => a.id === aluno.id);
            return (
              <div
                key={aluno.id}
                className={`dropdown-item ${jaSelecionado ? 'selected' : ''}`}
                onClick={() => onToggleAluno(aluno)}
              >
                <input
                  type="checkbox"
                  checked={!!jaSelecionado}
                  onChange={() => onToggleAluno(aluno)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>{aluno.nome}</span>
              </div>
            );
          })}
        </div>
      )}

      {alunosSelecionados.length > 0 && (
        <div className="selected-items-list">
          <div className="selected-count">
            {alunosSelecionados.length} aluno(s) selecionado(s)
          </div>
          {alunosSelecionados.map(aluno => (
            <div key={aluno.id} className="selected-item">
              <span>{aluno.nome}</span>
              <button
                type="button"
                onClick={() => onRemoverAluno(aluno.id)}
                className="btn-remove-small"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Componente principal do formulário
export function TurmaForm({ turma = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    codigo: '',
    nomeDisciplina: '',
    alunosSelecionados: [],
    professorSelecionado: null
  });

  useEffect(() => {
    if (turma) {
      setFormData({
        codigo: turma.codigo || '',
        nomeDisciplina: turma.nomeDisciplina || '',
        alunosSelecionados: turma.alunos || [],
        professorSelecionado: turma.professor || null
      });
    }
  }, [turma]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleAluno = (aluno) => {
    setFormData(prev => {
      const jaExiste = prev.alunosSelecionados.find(a => a.id === aluno.id);
      if (jaExiste) {
        return {
          ...prev,
          alunosSelecionados: prev.alunosSelecionados.filter(a => a.id !== aluno.id)
        };
      } else {
        return {
          ...prev,
          alunosSelecionados: [...prev.alunosSelecionados, aluno]
        };
      }
    });
  };

  const selecionarProfessor = (professor) => {
    setFormData(prev => ({
      ...prev,
      professorSelecionado: professor
    }));
  };

  const removerProfessor = () => {
    setFormData(prev => ({
      ...prev,
      professorSelecionado: null
    }));
  };

  const removerAluno = (alunoId) => {
    setFormData(prev => ({
      ...prev,
      alunosSelecionados: prev.alunosSelecionados.filter(a => a.id !== alunoId)
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
    <div className="turma-form-overlay">
      <div className="turma-form-container">
        <div className="turma-form-header">
          <h2>{turma ? 'Editar Turma' : 'Criar Nova Turma'}</h2>
          <button type="button" className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <div className="turma-form">
          <div className="form-group">
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

          <div className="form-group">
            <label>Professor *</label>
            <ProfessorSelector
              professorSelecionado={formData.professorSelecionado}
              onSelecionarProfessor={selecionarProfessor}
              onRemoverProfessor={removerProfessor}
            />
          </div>

          <div className="form-group">
            <label>Alunos</label>
            <AlunosSelector
              alunosSelecionados={formData.alunosSelecionados}
              onToggleAluno={toggleAluno}
              onRemoverAluno={removerAluno}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="button" className="btn-save" onClick={handleSubmit}>
              {turma ? 'Salvar Alterações' : 'Criar Turma'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}