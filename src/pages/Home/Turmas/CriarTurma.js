import { useState, useEffect } from 'react';
import { endpoints } from '../../../services/API/api';
import './styles/CriarTurma.css';

// Componente para seleção de professor
function ProfessorSelector({ professorSelecionado, onSelecionarProfessor, onRemoverProfessor, professoresDisponiveis }) {
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
          {professoresDisponiveis.length === 0 ? (
            <div className="dropdown-item disabled">Nenhum professor disponível</div>
          ) : (
            professoresDisponiveis.map(prof => (
              <div
                key={prof.id}
                className="dropdown-item"
                onClick={() => handleSelecionar(prof)}
              >
                {prof.nome}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Componente para seleção de alunos
function AlunosSelector({ alunosSelecionados, onToggleAluno, onRemoverAluno, alunosDisponiveis }) {
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
          {alunosDisponiveis.length === 0 ? (
            <div className="dropdown-item disabled">Nenhum aluno disponível</div>
          ) : (
            alunosDisponiveis.map(aluno => {
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
            })
          )}
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
  const [professoresDisponiveis, setProfessoresDisponiveis] = useState([]);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Carregar professores e alunos da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoadingDados(true);
        
        // Carregar professores
        const resProfessores = await fetch(`${endpoints.usuario.list}?role=PROFESSOR`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        if (resProfessores.ok) {
          const professores = await resProfessores.json();
          setProfessoresDisponiveis(professores);
        }

        // Carregar alunos
        const resAlunos = await fetch(`${endpoints.usuario.list}?role=ALUNO`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        if (resAlunos.ok) {
          const alunos = await resAlunos.json();
          setAlunosDisponiveis(alunos);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoadingDados(false);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (turma) {
      // Mapear alunos da turma para o formato esperado
      const alunosDaTurma = turma.alunos?.map(ta => ta.aluno) || [];
      
      setFormData({
        codigo: turma.codigo || '',
        nomeDisciplina: turma.disciplina || '',
        alunosSelecionados: alunosDaTurma,
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

  const handleSubmit = async () => {
    if (!formData.codigo || !formData.nomeDisciplina) {
      alert('Por favor, preencha código e nome da disciplina');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDados) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Carregando...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{turma ? 'Editar Turma' : 'Criar Nova Turma'}</h2>
          <button type="button" className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-form">
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
            <label>Professor</label>
            <ProfessorSelector
              professorSelecionado={formData.professorSelecionado}
              onSelecionarProfessor={selecionarProfessor}
              onRemoverProfessor={removerProfessor}
              professoresDisponiveis={professoresDisponiveis}
            />
          </div>

          <div className="form-group">
            <label>Alunos</label>
            <AlunosSelector
              alunosSelecionados={formData.alunosSelecionados}
              onToggleAluno={toggleAluno}
              onRemoverAluno={removerAluno}
              alunosDisponiveis={alunosDisponiveis}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="button" className="btn-save" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Salvando...' : (turma ? 'Salvar Alterações' : 'Criar Turma')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}