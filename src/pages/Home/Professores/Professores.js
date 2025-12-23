import { useState } from 'react';
import { Users, Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { initialProfessors } from './setProfessors';
import '../../styles/pages.css';
import './styles/Professores.css';

const ProfessorCard = ({ professor, onEdit, onDelete }) => (
  <div className="professor-card">
    <div className="card-header">
      <div>
        <h3 className="card-title">{professor.name}</h3>
        <p className="card-code">Código: {professor.code}</p>
      </div>
      <div className="card-actions">
        <button className="icon-btn edit" onClick={() => onEdit(professor.id)}>
          <Pencil size={18} />
        </button>
        <button className="icon-btn delete" onClick={() => onDelete(professor.id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    <div className="card-info">
      <div className="info-row">
        <svg className="email-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>{professor.email}</span>
      </div>
      
      <div className="info-row turmas">
        <Users size={18} />
        <span>{professor.turmas} turmas</span>
      </div>
    </div>
  </div>
);

export function ProfessoresContent() {
  const [professors, setProfessors] = useState(initialProfessors);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedProfessors = [...professors].sort((a, b) => {
      const valueA = a[key].toLowerCase();
      const valueB = b[key].toLowerCase();
      
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

  const handleEdit = (id) => {
    console.log('Editar professor:', id);
    // Implementar lógica de edição
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      setProfessors(professors.filter(prof => prof.id !== id));
    }
  };

  const handleCreateNew = () => {
    console.log('Criar novo professor');
    // Implementar lógica de criação
  };

  return (
    <>
        <main className="main-content">
          <div className="professores-content-wrapper">
            <h1 className="content-title">Professores</h1>
            <p className="content-subtitle">Gerencie todos os professores da escola</p>

            <div className="professores-toolbar">
              <button className="btn-primary" onClick={handleCreateNew}>
                <Plus size={20} />
                Criar Novo Professor
              </button>
              
              <div className="sort-buttons">
                <button 
                  className={`sort-btn ${sortConfig.key === 'name' ? 'active' : ''}`}
                  onClick={() => handleSort('name')}
                >
                  <ArrowUpDown size={18} />
                  Ordenar por Nome
                  {sortConfig.key === 'name' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="cards-grid">
              {professors.map((professor) => (
                <ProfessorCard
                  key={professor.id}
                  professor={professor}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </main>
    </>
  );
}