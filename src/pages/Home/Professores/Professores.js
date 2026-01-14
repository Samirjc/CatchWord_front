import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, ArrowUpDown, Mail, RefreshCw } from 'lucide-react';
import { ProfessorForm } from './CriarProfessor';
import { endpoints } from '../../../services/API/api';

const ProfessorCard = ({ professor, onEdit, onDelete, onReenviarConvite }) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">
        <h3 className="professor-nome">{professor.nome}</h3>
        <p className="card-code">
          {professor.cpf ? `CPF: ${professor.cpf}` : 'CPF não informado'}
        </p>
        {!professor.ativo && (
          <span className="status-badge pendente">Convite pendente</span>
        )}
      </div>
      <div className="card-actions">
        {!professor.ativo && (
          <button 
            className="btn-edit icon-btn" 
            onClick={() => onReenviarConvite(professor.id)}
            title="Reenviar convite"
          >
            <RefreshCw size={18} />
          </button>
        )}
        <button className="btn-edit icon-btn edit" onClick={() => onEdit(professor)}>
          <Pencil size={18} />
        </button>
        <button className="btn-remove icon-btn delete" onClick={() => onDelete(professor.id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    <div className="card-body">
      <div className="info-row">
        <Mail size={18}/>
        <span>{professor.email}</span>
      </div>
      
      <div className="info-row turmas">
        <Users size={18} />
        <span>{professor.turmasProfessor?.length || 0} turmas</span>
      </div>
    </div>
  </div>
);

export function ProfessoresContent() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [professorParaEditar, setProfessorParaEditar] = useState(null);
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };
  const carregarProfessores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${endpoints.usuario.list}?role=PROFESSOR`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Resposta do servidor:', response.status, errorData);
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Professores carregados:', data);
      setProfessors(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar professores:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        await carregarProfessores();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedProfessors = [...professors].sort((a, b) => {
      const valueA = (a[key] || '').toLowerCase();
      const valueB = (b[key] || '').toLowerCase();
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setProfessors(sortedProfessors);
    setSortConfig({ key, direction });
  };

  const handleCriarNovoProf = () => {
    setProfessorParaEditar(null);
    setMostrarForm(true);
  };

  const handleSave = async (formData) => {
    try {
      if (professorParaEditar) {
        // Editando professor existente
        const response = await fetch(endpoints.usuario.update(professorParaEditar.id), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nome: formData.nomeProfessor,
            cpf: formData.cpf
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao atualizar professor');
        }

        await carregarProfessores();
      } else {
        // Criando novo professor
        const response = await fetch(endpoints.usuario.create, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nome: formData.nomeProfessor,
            email: formData.email,
            cpf: formData.cpf,
            role: 'PROFESSOR'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao criar professor');
        }

        await carregarProfessores();
      }
      
      setMostrarForm(false);
      setProfessorParaEditar(null);
    } catch (err) {
      alert(err.message);
      console.error('Erro ao salvar professor:', err);
    }
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setProfessorParaEditar(null);
  };

  const handleEdit = (professor) => {
    setProfessorParaEditar(professor);
    setMostrarForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        const response = await fetch(endpoints.usuario.delete(id), {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao excluir professor');
        }

        await carregarProfessores();
      } catch (err) {
        alert(err.message);
        console.error('Erro ao excluir professor:', err);
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
          <h1 className="content-title">Professores</h1>
          <p className="content-subtitle">Carregando...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="content-title">Professores</h1>
          <p className="content-subtitle error-message">Erro: {error}</p>
          <button className="btn-primary" onClick={carregarProfessores}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
        <main className="main-content">
          <div className="content-wrapper">
            <h1 className="content-title">Professores</h1>
            <p className="content-subtitle">Gerencie todos os professores da escola</p>

            <div className="toolbar">
              <button className="btn-primary" onClick={handleCriarNovoProf}>
                <Plus size={20} />
                Criar Novo Professor
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
              </div>
            </div>

            {professors.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>Nenhum professor cadastrado</p>
                <button className="btn-primary" onClick={handleCriarNovoProf}>
                  <Plus size={20} />
                  Criar Primeiro Professor
                </button>
              </div>
            ) : (
              <div className="card-grid">
                {professors.map((professor) => (
                  <ProfessorCard
                    key={professor.id}
                    professor={professor}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onReenviarConvite={handleReenviarConvite}
                  />
                ))}
              </div>
            )}
          </div>
          {mostrarForm && (
              <ProfessorForm
                professor={professorParaEditar}
                onSave={handleSave}
                onCancel={handleCancel}
              />
          )}
        </main>
    </>
  );
}