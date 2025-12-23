import { useState } from 'react';
import { Pencil, Trash2, Plus, Mail, Book, ArrowUpDown } from 'lucide-react';
import { initialAlunos } from './setAlunos';
import '../../styles/pages.css'
import './styles/Alunos.css'

const StudentCard = ({ aluno, onEdit, onDelete }) => {
  return (
    <div className="aluno-card">
      <div className="aluno-card-header">
        <h3 className="aluno-nome">{aluno.name}</h3>
        <div className="aluno-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(aluno)}
            aria-label="Editar aluno"
          >
            <Pencil size={18} />
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(aluno.id)}
            aria-label="Excluir aluno"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <p className="aluno-code">Código: {aluno.code}</p>
      
      <div className="aluno-info">
        <div className="info-item">
          <Mail size={16} />
          <span>{aluno.email}</span>
        </div>
        <div className="info-item turma-info">
          <Book size={16} />
          <span>{aluno.grade}</span>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export function AlunosContent(){
  const [students, setStudents] = useState(initialAlunos);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedStudents = [...students].sort((a, b) => {
      let valueA, valueB;
      
      if (key === 'name') {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      } else if (key === 'grade') {
        // Extrai o número do ano (ex: "5º Ano" -> 5)
        valueA = parseInt(a.grade.match(/\d+/)?.[0] || 0);
        valueB = parseInt(b.grade.match(/\d+/)?.[0] || 0);
      }
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setStudents(sortedStudents);
    setSortConfig({ key, direction });
  };

  const handleCreateStudent = () => {
    alert('Abrir modal de criação de novo aluno');
  };

  const handleEditStudent = (aluno) => {
    alert(`Editar aluno: ${aluno.name}`);
  };

  const handleDeleteStudent = (alunoId) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setStudents(students.filter(s => s.id !== alunoId));
    }
  };

  return (
    <>
    <main className='alunos-main-content'>
        <div className="alunos-content-wrapper">
              <h1 className="content-title">Alunos</h1>
              <p className="content-subtitle">Gerencie todos os alunos da escola</p>
            
            <div className="alunos-toolbar">
              <button className="create-btn" onClick={handleCreateStudent}>
                <Plus size={20} />
                Criar Novo Aluno
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
                
                <button 
                  className={`sort-btn ${sortConfig.key === 'grade' ? 'active' : ''}`}
                  onClick={() => handleSort('grade')}
                >
                  <ArrowUpDown size={18} />
                  Ordenar por Ano
                  {sortConfig.key === 'grade' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
          <div className="cards-grid">
            {students.map(aluno => (
              <StudentCard
                key={aluno.id}
                aluno={aluno}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            ))}
          </div>
        </div>
    </main>
    </>
  );
};
