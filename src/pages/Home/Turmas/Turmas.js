import { Pencil, Trash2, UsersRound, Users, Plus, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import '../../styles/pages.css';
import './styles/Turmas.css';
import {TurmaForm} from './CriarTurma.js';

function TurmaCard({ turma, onEdit, onDelete, userProfile }) {
  const isCoordenador = userProfile === 'coordenador';
  
  return (
    <div className="turma-card">
      <div className="turma-header">
        <div className="turma-info">
          <h3 className="turma-name">{turma.nome}</h3>
          <p className="turma-code">Código: {turma.codigo}</p>
        </div>
        {isCoordenador && (
          <div className="turma-actions">
            <button className="icon-btn edit" title="Editar turma" onClick={() => onEdit(turma.id)}>
              <Pencil size={16} />
            </button>
            <button className="icon-btn delete" title="Excluir turma" onClick={() => onDelete(turma.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="turma-stats">
        <div className="stat-item">
          <UsersRound size={18} className="stat-icon" />
          <span>{turma.alunos} alunos</span>
        </div>
      </div>
    </div>
  );
}

// Dados mockados por perfil
const turmasDataInitial = {
  coordenador: [
    { 
      id: 1, 
      nome: '6º Ano A', 
      codigo: 'TUR001', 
      alunos: 2,
      nomeDisciplina: '6º Ano A',
      professor: { id: 1, nome: 'Prof. Carlos Mendes' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
    { 
      id: 2, 
      nome: '6º Ano B', 
      codigo: 'TUR002', 
      alunos: 2,
      nomeDisciplina: '6º Ano B',
      professor: { id: 2, nome: 'Prof. Paula Rocha' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
    { 
      id: 3, 
      nome: '7º Ano A', 
      codigo: 'TUR003', 
      alunos: 2,
      nomeDisciplina: '7º Ano A',
      professor: { id: 1, nome: 'Prof. Carlos Mendes' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
    { 
      id: 4, 
      nome: '7º Ano B', 
      codigo: 'TUR004', 
      alunos: 2,
      nomeDisciplina: '7º Ano B',
      professor: { id: 3, nome: 'Prof. Roberto Lima' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
    { 
      id: 5, 
      nome: '8º Ano A', 
      codigo: 'TUR005', 
      alunos: 2,
      nomeDisciplina: '8º Ano A',
      professor: { id: 2, nome: 'Prof. Paula Rocha' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
    { 
      id: 6, 
      nome: '9º Ano A', 
      codigo: 'TUR006', 
      alunos: 2,
      nomeDisciplina: '9º Ano A',
      professor: { id: 1, nome: 'Prof. Carlos Mendes' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
  ],
  professor: [
    { 
      id: 1, 
      nome: '6º Ano A', 
      codigo: 'TUR001', 
      alunos: 2,
      nomeDisciplina: '6º Ano A',
      professor: { id: 1, nome: 'Prof. Carlos Mendes' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
    { 
      id: 3, 
      nome: '7º Ano A', 
      codigo: 'TUR003', 
      alunos: 2,
      nomeDisciplina: '7º Ano A',
      professor: { id: 1, nome: 'Prof. Carlos Mendes' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
    { 
      id: 5, 
      nome: '8º Ano A', 
      codigo: 'TUR005', 
      alunos: 2,
      nomeDisciplina: '8º Ano A',
      professor: { id: 1, nome: 'Prof. Carlos Mendes' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
  ],
  aluno: [
    { 
      id: 1, 
      nome: '6º Ano A', 
      codigo: 'TUR001', 
      alunos: 2,
      nomeDisciplina: '6º Ano A',
      professor: { id: 1, nome: 'Prof. Carlos Mendes' },
      alunosSelecionados: [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' }
      ]
    },
  ],
};

export function TurmasContent({ userProfile }) {
  const [turmas, setTurmas] = useState(turmasDataInitial[userProfile] || []);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [turmaParaEditar, setTurmaParaEditar] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedTurmas = [...turmas].sort((a, b) => {
      // Extrai o número do ano (ex: "6º Ano A" -> 6)
      const valueA = parseInt(a.nome.match(/\d+/)?.[0] || 0);
      const valueB = parseInt(b.nome.match(/\d+/)?.[0] || 0);
      
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

  const handleSave = (formData) => {
    console.log('Dados da turma salvos:', formData);
    
    if (turmaParaEditar) {
      // Editando turma existente
      const turmasAtualizadas = turmas.map(turma => 
        turma.id === turmaParaEditar.id 
          ? {
              ...turma,
              nome: formData.nomeDisciplina,
              codigo: formData.codigo,
              alunos: formData.alunosSelecionados.length,
              nomeDisciplina: formData.nomeDisciplina,
              professor: formData.professorSelecionado,
              alunosSelecionados: formData.alunosSelecionados
            }
          : turma
      );
      setTurmas(turmasAtualizadas);
    } else {
      // Criando nova turma
      const novaTurma = {
        id: turmas.length + 1,
        nome: formData.nomeDisciplina,
        codigo: formData.codigo,
        alunos: formData.alunosSelecionados.length,
        nomeDisciplina: formData.nomeDisciplina,
        professor: formData.professorSelecionado,
        alunosSelecionados: formData.alunosSelecionados
      };
      setTurmas([...turmas, novaTurma]);
    }
    
    setMostrarForm(false);
    setTurmaParaEditar(null);
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setTurmaParaEditar(null);
  };

  const handleCriarNovaTurma = () => {
    setTurmaParaEditar(null);
    setMostrarForm(true);
  };

  const handleEdit = (id) => {
    const turma = turmas.find(turma => turma.id === id);
    setTurmaParaEditar(turma);
    setMostrarForm(true);
  }

  const handleDelete = (id) => {
    const turmasAtualizadas = turmas.filter(turma => turma.id !== id);
    setTurmas(turmasAtualizadas);
  }
  const isCoordenador = userProfile === 'coordenador';

  return (
    <main className="main-content">
      <div className="content-header">
        <h1 className="content-title">Turmas</h1>
        <p className="content-subtitle">
          {userProfile === 'coordenador' && 'Gerencie todas as turmas da escola'}
          {userProfile === 'professor' && 'Suas classes'}
          {userProfile === 'aluno' && 'Suas turmas'}
        </p>
      </div>

      {isCoordenador && (
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCriarNovaTurma}>
            <Plus size={20} />
            Criar Nova Turma
          </button>
          
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortConfig.key === 'year' ? 'active' : ''}`}
              onClick={() => handleSort('year')}
            >
              <ArrowUpDown size={18} />
              Ordenar por Ano
              {sortConfig.key === 'year' && (
                <span className="sort-indicator">
                  {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {turmas.length > 0 ? (
        <div className="turmas-grid">
          {turmas.map((turma) => (
            <TurmaCard 
              key={turma.id} 
              turma={turma} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              userProfile={userProfile} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={40} />
          </div>
          <h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Nenhuma turma encontrada</h3>
          <p>Você ainda não está alocado em nenhuma turma.</p>
        </div>
      )}

      {mostrarForm && (
        <TurmaForm
          turma={turmaParaEditar}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
}