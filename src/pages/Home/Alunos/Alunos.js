import { useState } from 'react';
import { Pencil, Trash2, Plus, Mail, Book, ArrowUpDown } from 'lucide-react';
import { initialAlunos } from './setAlunos';
import { AlunoForm } from './CriarAluno';


const AlunoCard = ({ aluno, onEdit, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3 className='aluno-nome'>{aluno.name}</h3>
          <p className="card-code">Código: {aluno.code}</p>
        </div>
        <div className="card-actions">
          <button 
            className="btn-edit icon-btn edit" 
            onClick={() => onEdit(aluno.id)}
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
        <div className="info-row turmas">
          <Book size={16} />
          <span>{aluno.grade}</span>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
export function AlunosContent(){
  const [alunos, setAlunos] = useState(initialAlunos);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [alunoParaEditar, setAlunoParaEditar] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedStudents = [...alunos].sort((a, b) => {
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
    
    setAlunos(sortedStudents);
    setSortConfig({ key, direction });
  };

  const handleCriarNovoAluno = () => {
    setAlunoParaEditar(null);
    setMostrarForm(true);
  };

  const handleSave = (formData) => {
    console.log('Dados do aluno salvos:', formData);

    
    if(alunoParaEditar){
      // Editando aluno existente
      const alunosAtualizados = alunos.map(aluno =>
         aluno.id === alunoParaEditar.id
          ? {
              ...aluno,
              name: formData.nome,
              email: formData.email,
              cpf: formData.cpf,
              code: formData.codigo,
          }
        : aluno
      );
      setAlunos(alunosAtualizados)
    } else{
      // Criando novo aluno
      const novoAluno = {
        id: alunos.length + 1,
        name: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        code: formData.codigo,
      };
      setAlunos([...alunos, novoAluno]);
    }

    setMostrarForm(false);
    setAlunoParaEditar(null);
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setAlunoParaEditar(null);
  }

  const handleEdit = (id) => {
    const aluno = alunos.find(aluno => aluno.id === id);
    setAlunoParaEditar(aluno);
    setMostrarForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setAlunos(alunos.filter(s => s.id !== id));
    }
  };

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
                
                <button 
                  className={`btn-sort ${sortConfig.key === 'grade' ? 'active' : ''}`}
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
            
          <div className="card-grid">
            {alunos.map(aluno => (
              <AlunoCard
                key={aluno.id}
                aluno={aluno}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
        {mostrarForm && (
          <AlunoForm
          aluno={alunoParaEditar}
          onSave={handleSave}
          onCancel={handleCancel}/>
        )}
    </main>
    </>
  );
};
