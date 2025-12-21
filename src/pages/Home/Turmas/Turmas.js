import { Pencil, Trash2, UsersRound, Users, Plus, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import './Turmas.css'

function TurmaCard({ turma, userProfile }) {
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
            <button className="icon-btn edit" title="Editar turma">
              <Pencil size={16} />
            </button>
            <button className="icon-btn delete" title="Excluir turma">
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

export function TurmasContent({ userProfile }) {
  // Dados mockados por perfil
  const turmasDataInitial = {
    coordenador: [
      { id: 1, nome: '6º Ano A', codigo: 'TUR001', alunos: 28},
      { id: 2, nome: '6º Ano B', codigo: 'TUR002', alunos: 30},
      { id: 3, nome: '7º Ano A', codigo: 'TUR003', alunos: 25},
      { id: 4, nome: '7º Ano B', codigo: 'TUR004', alunos: 27},
      { id: 5, nome: '8º Ano A', codigo: 'TUR005', alunos: 32},
      { id: 6, nome: '9º Ano A', codigo: 'TUR006', alunos: 29},
    ],
    professor: [
      { id: 1, nome: '6º Ano A', codigo: 'TUR001', alunos: 28},
      { id: 3, nome: '7º Ano A', codigo: 'TUR003', alunos: 25},
      { id: 5, nome: '8º Ano A', codigo: 'TUR005', alunos: 32},
    ],
    aluno: [
      { id: 1, nome: '6º Ano A', codigo: 'TUR001', alunos: 28 },
    ],
  };

  const [turmas, setTurmas] = useState(turmasDataInitial[userProfile] || []);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  const isCoordenador = userProfile === 'coordenador';

  return (
    <div className="turmas-main-content">
      <div className="content-header">
        <h1 className="content-title">Turmas</h1>
        <p className="content-subtitle">
          {userProfile === 'coordenador' && 'Gerencie todas as turmas da escola'}
          {userProfile === 'professor' && 'Suas turmas alocadas'}
          {userProfile === 'aluno' && 'Suas turmas'}
        </p>
      </div>

      {isCoordenador && (
        <div className="header-actions">
          <button className="btn-primary">
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
            <TurmaCard key={turma.id} turma={turma} userProfile={userProfile} />
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
    </div>
  );
}