import { Pencil, Trash2, UsersRound, Users, Plus, ArrowUpDown, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TurmaForm } from './CriarTurma.js';
import { VisualizarTurma } from './VisualizarTurma.js';
import { endpoints } from '../../../services/API/api';

function TurmaCard({ turma, onEdit, onDelete, onView, userProfile }) {
  const isCoordenador = userProfile === 'coordenador';
  
  // Conta o número de alunos na turma
  const numAlunos = turma.alunos?.length || 0;
  
  return (
    <div className="card turma-card-clickable" onClick={() => onView(turma)}>
      <div className="card-header">
        <div className="card-title">
          <h3 className="turma-name">{turma.disciplina}</h3>
          <p className="card-code">Código: {turma.codigo}</p>
        </div>
        {isCoordenador && (
          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
            <button className="btn-view icon-btn view" title="Visualizar turma" onClick={() => onView(turma)}>
              <Eye size={16} />
            </button>
            <button className="btn-edit icon-btn edit" title="Editar turma" onClick={() => onEdit(turma)}>
              <Pencil size={16} />
            </button>
            <button className="btn-remove icon-btn delete" title="Excluir turma" onClick={() => onDelete(turma.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="card-body">
        <div className="info-row">
          <UsersRound size={18} />
          <span>{numAlunos} alunos</span>
        </div>
        {turma.professor && (
          <div className="info-row">
            <Users size={18} />
            <span>{turma.professor.nome}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TurmasContent({ userProfile }) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);
  const [turmaParaVisualizar, setTurmaParaVisualizar] = useState(null);
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const getUsuario = () => {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  };

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usuario = getUsuario();
      const escolaId = usuario.escolaId;
      const usuarioId = usuario.id;
      const role = usuario.role?.toLowerCase();

      if (!escolaId) {
        throw new Error('Escola não encontrada');
      }

      let url;
      // Coordenador vê todas as turmas da escola
      // Professor vê apenas as turmas que leciona
      // Aluno vê apenas as turmas em que está matriculado
      if (role === 'coordenador') {
        url = endpoints.turma.getByEscola(escolaId);
      } else if (role === 'professor') {
        url = endpoints.turma.getByProfessor(usuarioId);
      } else if (role === 'aluno') {
        url = endpoints.turma.getByAluno(usuarioId);
      } else {
        url = endpoints.turma.getByEscola(escolaId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTurmas(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar turmas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedTurmas = [...turmas].sort((a, b) => {
      const valueA = (a.disciplina || '').toLowerCase();
      const valueB = (b.disciplina || '').toLowerCase();
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setTurmas(sortedTurmas);
    setSortConfig({ key, direction });
  };

  const handleCriarNovaTurma = () => {
    setTurmaParaEditar(null);
    setMostrarForm(true);
  };

  const handleView = (turma) => {
    setTurmaParaVisualizar(turma);
  };

  const handleCloseView = () => {
    setTurmaParaVisualizar(null);
  };

  const handleSave = async (formData) => {
    try {
      const usuario = getUsuario();
      const escolaId = usuario.escolaId;
      
      if (turmaParaEditar) {
        // Editando turma existente
        const response = await fetch(endpoints.turma.update(turmaParaEditar.id), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            codigo: formData.codigo,
            disciplina: formData.nomeDisciplina
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao atualizar turma');
        }

        // Atualizar professor se foi selecionado
        if (formData.professorSelecionado) {
          await fetch(endpoints.turma.atualizarProfessor(turmaParaEditar.id), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              professorId: formData.professorSelecionado.id
            })
          });
        } else if (turmaParaEditar.professor) {
          // Remover professor se foi desmarcado
          await fetch(endpoints.turma.removerProfessor(turmaParaEditar.id), {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
        }

        // Sincronizar alunos da turma
        const alunosAtuais = turmaParaEditar.alunos?.map(ta => ta.aluno.id) || [];
        const alunosNovos = formData.alunosSelecionados.map(a => a.id);

        // Remover alunos que foram desmarcados
        for (const alunoId of alunosAtuais) {
          if (!alunosNovos.includes(alunoId)) {
            await fetch(endpoints.turma.removerAluno(turmaParaEditar.id, alunoId), {
              method: 'DELETE',
              headers: getAuthHeaders()
            });
          }
        }

        // Adicionar alunos novos
        for (const alunoId of alunosNovos) {
          if (!alunosAtuais.includes(alunoId)) {
            await fetch(endpoints.turma.adicionarAluno(turmaParaEditar.id), {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                alunoId: alunoId
              })
            });
          }
        }

        await carregarTurmas();
      } else {
        // Criando nova turma
        const response = await fetch(endpoints.turma.create, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            codigo: formData.codigo,
            disciplina: formData.nomeDisciplina,
            escolaId: escolaId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao criar turma');
        }

        const novaTurma = await response.json();

        // Adicionar professor se foi selecionado
        if (formData.professorSelecionado) {
          await fetch(endpoints.turma.atualizarProfessor(novaTurma.id), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              professorId: formData.professorSelecionado.id
            })
          });
        }

        // Adicionar alunos selecionados
        for (const aluno of formData.alunosSelecionados) {
          await fetch(endpoints.turma.adicionarAluno(novaTurma.id), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              alunoId: aluno.id
            })
          });
        }

        await carregarTurmas();
      }

      setMostrarForm(false);
      setTurmaParaEditar(null);
    } catch (err) {
      alert(err.message);
      console.error('Erro ao salvar turma:', err);
    }
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setTurmaParaEditar(null);
  };

  const handleEdit = (turma) => {
    setTurmaParaEditar(turma);
    setMostrarForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        const response = await fetch(endpoints.turma.delete(id), {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao excluir turma');
        }

        await carregarTurmas();
      } catch (err) {
        alert(err.message);
        console.error('Erro ao excluir turma:', err);
      }
    }
  };
  
  const isCoordenador = userProfile === 'coordenador';

  if (loading) {
    return (
      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="content-title">Turmas</h1>
          <p className="content-subtitle">Carregando...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="content-title">Turmas</h1>
          <p className="content-subtitle error-message">Erro: {error}</p>
          <button className="btn-primary" onClick={carregarTurmas}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className='content-wrapper'>
        <h1 className="content-title">Turmas</h1>
        <p className="content-subtitle">
          {userProfile === 'coordenador' && 'Gerencie todas as turmas da escola'}
          {userProfile === 'professor' && 'Suas classes'}
          {userProfile === 'aluno' && 'Suas turmas'}
        </p>

        {isCoordenador && (
          <div className="toolbar">
            <button className="btn-primary" onClick={handleCriarNovaTurma}>
              <Plus size={20} />
              Criar Nova Turma
            </button>
            
            <div className="sort-buttons">
              <button 
                className={`btn-sort ${sortConfig.key === 'disciplina' ? 'active' : ''}`}
                onClick={() => handleSort('disciplina')}
              >
                <ArrowUpDown size={18} />
                Ordenar por Nome
                {sortConfig.key === 'disciplina' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {turmas.length > 0 ? (
          <div className="card-grid">
            {turmas.map((turma) => (
              <TurmaCard 
                key={turma.id} 
                turma={turma} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                userProfile={userProfile} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <p>Nenhuma turma cadastrada</p>
            {isCoordenador && (
              <button className="btn-primary" onClick={handleCriarNovaTurma}>
                <Plus size={20} />
                Criar Primeira Turma
              </button>
            )}
          </div>
        )}
      </div>

      {mostrarForm && (
        <TurmaForm
          turma={turmaParaEditar}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {turmaParaVisualizar && (
        <VisualizarTurma
          turma={turmaParaVisualizar}
          onClose={handleCloseView}
          userProfile={userProfile}
        />
      )}
    </main>
  );
}