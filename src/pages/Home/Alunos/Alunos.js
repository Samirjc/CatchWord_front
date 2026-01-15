import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Mail, ArrowUpDown, Users, RefreshCw } from 'lucide-react';
import { AlunoForm } from './CriarAluno';
import { endpoints } from '../../../services/API/api';

const AlunoCard = ({ aluno, onEdit, onDelete, onReenviarConvite }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className='aluno-nome'>{aluno.nome}</h3>
          <p className="card-code">
            {aluno.matricula ? `Matrícula: ${aluno.matricula}` : 'Matrícula não informada'}
          </p>
          {!aluno.ativo && (
            <span className="status-badge pendente">Convite pendente</span>
          )}
        </div>
        <div className="card-actions">
          {!aluno.ativo && (
            <button 
              className="btn-edit icon-btn" 
              onClick={() => onReenviarConvite(aluno.id)}
              title="Reenviar convite"
            >
              <RefreshCw size={18} />
            </button>
          )}
          <button 
            className="btn-edit icon-btn edit" 
            onClick={() => onEdit(aluno)}
            aria-label="Editar aluno"
          >
            <Pencil size={18} />
          </button>
          <button 
            className="btn-remove icon-btn remove" 
            onClick={() => onDelete(aluno.id)}
            aria-label="Excluir aluno"
          >
            <Trash2 size={18} />
          </button>
        </div>  
      </div>
        <div className="card-body">
        <div className="info-row">
          <Mail size={16} />
          <span>{aluno.email}</span>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export function AlunosContent(){
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [alunoParaEditar, setAlunoParaEditar] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${endpoints.usuario.list}?role=ALUNO`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAlunos(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar alunos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedStudents = [...alunos].sort((a, b) => {
      let valueA, valueB;
      
      if (key === 'nome') {
        valueA = (a.nome || '').toLowerCase();
        valueB = (b.nome || '').toLowerCase();
      } else if (key === 'matricula') {
        valueA = (a.matricula || '').toLowerCase();
        valueB = (b.matricula || '').toLowerCase();
      }
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setAlunos(sortedStudents);
    setSortConfig({ key, direction });
  };

  const handleCriarNovoAluno = () => {
    setAlunoParaEditar(null);
    setMostrarForm(true);
  };

  const handleSave = async (formData) => {
    try {
      if (alunoParaEditar) {
        // Editando aluno existente
        const response = await fetch(endpoints.usuario.update(alunoParaEditar.id), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nome: formData.nome,
            cpf: formData.cpf,
            matricula: formData.matricula
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao atualizar aluno');
        }

        await carregarAlunos();
      } else {
        // Criando novo aluno
        const response = await fetch(endpoints.usuario.create, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            cpf: formData.cpf,
            matricula: formData.matricula,
            role: 'ALUNO'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao criar aluno');
        }

        await carregarAlunos();
      }

      setMostrarForm(false);
      setAlunoParaEditar(null);
    } catch (err) {
      alert(err.message);
      console.error('Erro ao salvar aluno:', err);
    }
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setAlunoParaEditar(null);
  };

  const handleEdit = (aluno) => {
    setAlunoParaEditar(aluno);
    setMostrarForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        const response = await fetch(endpoints.usuario.delete(id), {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao excluir aluno');
        }

        await carregarAlunos();
      } catch (err) {
        alert(err.message);
        console.error('Erro ao excluir aluno:', err);
      }
    }
  };

  const handleReenviarConvite = async (id) => {
    try {
      const response = await fetch(endpoints.usuario.reenviarConvite(id), {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao reenviar convite');
      }

      alert('Convite reenviado com sucesso!');
    } catch (err) {
      alert(err.message);
      console.error('Erro ao reenviar convite:', err);
    }
  };

  if (loading) {
    return (
      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="content-title">Alunos</h1>
          <p className="content-subtitle">Carregando...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="content-title">Alunos</h1>
          <p className="content-subtitle error-message">Erro: {error}</p>
          <button className="btn-primary" onClick={carregarAlunos}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
    <main className='main-content alunos-main-content'>
        <div className="content-wrapper">
          <h1 className="content-title">Alunos</h1>
          <p className="content-subtitle">Gerencie todos os alunos da escola</p>
            
          <div className="toolbar">
            <button className="btn-primary" onClick={handleCriarNovoAluno}>
              <Plus size={20} />
              Criar Novo Aluno
            </button>
            
            <div className="sort-buttons">
              <button 
                className={`btn-sort ${sortConfig.key === 'nome' ? 'active' : ''}`}
                onClick={() => handleSort('nome')}
              >
                <ArrowUpDown size={18} />
                Ordenar por Nome
                {sortConfig.key === 'nome' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </button>
              
              <button 
                className={`btn-sort ${sortConfig.key === 'matricula' ? 'active' : ''}`}
                onClick={() => handleSort('matricula')}
              >
                <ArrowUpDown size={18} />
                Ordenar por Matrícula
                {sortConfig.key === 'matricula' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {alunos.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>Nenhum aluno cadastrado</p>
              <button className="btn-primary" onClick={handleCriarNovoAluno}>
                <Plus size={20} />
                Criar Primeiro Aluno
              </button>
            </div>
          ) : (
            <div className="card-grid">
              {alunos.map(aluno => (
                <AlunoCard
                  key={aluno.id}
                  aluno={aluno}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReenviarConvite={handleReenviarConvite}
                />
              ))}
            </div>
          )}
        </div>
        {mostrarForm && (
          <AlunoForm
            aluno={alunoParaEditar}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
    </main>
    </>
  );
}
