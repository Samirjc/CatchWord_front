import { useState, useEffect } from 'react';
import './CriarTurma.css';

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

export function TurmaForm({ turma = null, onSave, onCancel }){
  const [formData, setFormData] = useState({
    codigo: '',
    nomeDisciplina: '',
    alunosSelecionados: [],
    professorSelecionado: null
  });

  const [mostrarListaAlunos, setMostrarListaAlunos] = useState(false);
  const [mostrarListaProfessores, setMostrarListaProfessores] = useState(false);
  
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
    setMostrarListaProfessores(false);
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
          <button className="btn-close" onClick={onCancel}>✕</button>
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
            <div className="selector-container">
              {formData.professorSelecionado ? (
                <div className="selected-item">
                  <span>{formData.professorSelecionado.nome}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, professorSelecionado: null }))}
                    className="btn-remove-small"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  className="btn-add"
                  onClick={() => setMostrarListaProfessores(!mostrarListaProfessores)}
                >
                  + Selecionar Professor
                </button>
              )}

              {mostrarListaProfessores && (
                <div className="dropdown-list">
                  {professoresDisponiveis.map(prof => (
                    <div
                      key={prof.id}
                      className="dropdown-item"
                      onClick={() => selecionarProfessor(prof)}
                    >
                      {prof.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Alunos</label>
            <button
              className="btn-add"
              onClick={() => setMostrarListaAlunos(!mostrarListaAlunos)}
            >
              + Adicionar Alunos
            </button>

            {mostrarListaAlunos && (
              <div className="dropdown-list">
                {alunosDisponiveis.map(aluno => {
                  const jaSelecionado = formData.alunosSelecionados.find(a => a.id === aluno.id);
                  return (
                    <div
                      key={aluno.id}
                      className={`dropdown-item ${jaSelecionado ? 'selected' : ''}`}
                      onClick={() => toggleAluno(aluno)}
                    >
                      <input
                        type="checkbox"
                        checked={!!jaSelecionado}
                        onChange={() => toggleAluno(aluno)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>{aluno.nome}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {formData.alunosSelecionados.length > 0 && (
              <div className="selected-items-list">
                <div className="selected-count">
                  {formData.alunosSelecionados.length} aluno(s) selecionado(s)
                </div>
                {formData.alunosSelecionados.map(aluno => (
                  <div key={aluno.id} className="selected-item">
                    <span>{aluno.nome}</span>
                    <button
                      onClick={() => removerAluno(aluno.id)}
                      className="btn-remove-small"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn-save" onClick={handleSubmit}>
              {turma ? 'Salvar Alterações' : 'Criar Turma'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exemplo de uso do componente
const App = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);

  const handleSave = (formData) => {
    console.log('Dados salvos:', formData);
    setMostrarForm(false);
    setTurmaParaEditar(null);
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setTurmaParaEditar(null);
  };

  const editarTurmaExemplo = () => {
    setTurmaParaEditar({
      codigo: 'TUR001',
      nomeDisciplina: '6° Ano A',
      alunos: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ],
      professor: { id: 1, nome: 'Prof. Carlos Mendes' }
    });
    setMostrarForm(true);
  };

  return (
    <div className="app-demo">
      <div className="demo-buttons">
        <button 
          className="btn-demo"
          onClick={() => { setTurmaParaEditar(null); setMostrarForm(true); }}
        >
          Criar Nova Turma
        </button>
        <button 
          className="btn-demo btn-secondary"
          onClick={editarTurmaExemplo}
        >
          Editar Turma (Exemplo)
        </button>
      </div>

      {mostrarForm && (
        <TurmaForm
          turma={turmaParaEditar}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default App;