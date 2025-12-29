import { useState } from 'react';
import { Users, Plus, Pencil, Trash2, ArrowUpDown, Mail } from 'lucide-react';
import { initialProfessors } from './setProfessors';
import { ProfessorForm } from './CriarProfessor';

const ProfessorCard = ({ professor, onEdit, onDelete }) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">
        <h3 className="professor-nome">{professor.name}</h3>
        <p className="card-code">Código: {professor.code}</p>
      </div>
      <div className="card-actions">
        <button className="btn-edit icon-btn edit" onClick={() => onEdit(professor.id)}>
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
        <span>{professor.turmas} turmas</span>
      </div>
    </div>
  </div>
);

export function ProfessoresContent() {
  const [professors, setProfessors] = useState(initialProfessors);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [professorParaEditar, setProfessorParaEditar] = useState(null);

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

  const handleCriarNovoProf = () => {
    setProfessorParaEditar(null);
    setMostrarForm(true);
  };

  const handleSave = (formData) => {
    if(professorParaEditar){
      // Editando professor existente
      const professoresAtualizados = professors.map(professor =>
         professor.id === professorParaEditar.id
          ? {
              ...professor,
              name: formData.nomeProfessor,
              email: formData.email,
              cpf: formData.cpf,
              code: formData.code,
          }
        : professor
      );
      setProfessors(professoresAtualizados)
    } else {
      // Criando novo professor
      const novoProfessor = {
        id: professors.length + 1,
        name: formData.nomeProfessor,
        email: formData.email,
        cpf: formData.cpf,
        code: formData.code,
        turmas: 0
      };
      setProfessors([...professors, novoProfessor]);
    }
    
    setMostrarForm(false);
    setProfessorParaEditar(null);
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setProfessorParaEditar(null);
  };

  const handleEdit = (id) => {
    const professor = professors.find(professor => professor.id === id);
    setProfessorParaEditar(professor);
    setMostrarForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      setProfessors(professors.filter(prof => prof.id !== id));
    }
  };

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
                  className={`btn-sort ${sortConfig.key === 'name' ? 'active' : ''}`}
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

            <div className="card-grid">
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