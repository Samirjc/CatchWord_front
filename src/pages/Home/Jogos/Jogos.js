import { Pencil, Trash2, Gamepad2, Plus, ArrowUpDown, Calendar, Grid3X3, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { JogoForm } from './CriarJogo.js';
import { VisualizarJogo } from './VisualizarJogo.js';
import { endpoints } from '../../../services/API/api';
import { ConfirmModal } from '../../../components/ConfirmModal/ConfirmModal';
import './styles/Jogos.css';

function JogoCard({ jogo, onEdit, onDelete, onView }) {
  const numPalavras = jogo._count?.palavras || 0;
  const numPartidas = jogo._count?.partidas || 0;
  
  const getDificuldadeLabel = (dificuldade) => {
    const labels = {
      'FACIL': 'Fácil',
      'MEDIO': 'Médio',
      'DIFICIL': 'Difícil'
    };
    return labels[dificuldade] || dificuldade;
  };

  const getDificuldadeClass = (dificuldade) => {
    const classes = {
      'FACIL': 'facil',
      'MEDIO': 'medio',
      'DIFICIL': 'dificil'
    };
    return classes[dificuldade] || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  return (
    <div className={`card jogo-card ${jogo.ativo ? '' : 'inativo'}`}>
      <div className="card-header">
        <div className="card-title">
          <h3 className="jogo-name">{jogo.titulo}</h3>
          <p className="card-code">Tema: {jogo.tema}</p>
        </div>
        <div className="card-actions">
          <button className="icon-btn view" title="Visualizar jogo" onClick={() => onView(jogo)}>
            <Eye size={16} />
          </button>
          <button className="btn-edit icon-btn edit" title="Editar jogo" onClick={() => onEdit(jogo)}>
            <Pencil size={16} />
          </button>
          <button 
            className="btn-remove icon-btn delete" 
            title={numPartidas > 0 ? "Não é possível excluir jogos com partidas" : "Excluir jogo"} 
            onClick={() => onDelete(jogo)}
            disabled={numPartidas > 0}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="card-body">
        {jogo.descricao && (
          <p className="jogo-descricao">{jogo.descricao}</p>
        )}
        
        <div className="jogo-info-grid">
          <div className="info-row">
            <Grid3X3 size={16} />
            <span>{jogo.largura}x{jogo.altura}</span>
          </div>
          <div className="info-row">
            <Gamepad2 size={16} />
            <span>{numPalavras} palavras</span>
          </div>
        </div>

        <div className="jogo-footer">
          <span className={`dificuldade-badge ${getDificuldadeClass(jogo.dificuldade)}`}>
            {getDificuldadeLabel(jogo.dificuldade)}
          </span>
          <span className={`status-badge ${jogo.ativo ? 'ativo' : 'inativo'}`}>
            {jogo.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="info-row data-criacao">
          <Calendar size={14} />
          <span>Criado em {formatDate(jogo.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export function JogosContent() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [jogoParaEditar, setJogoParaEditar] = useState(null);
  const [jogoParaVisualizar, setJogoParaVisualizar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jogoParaDeletar, setJogoParaDeletar] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const carregarJogos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoints.jogo.list, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setJogos(data.jogos || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar jogos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarJogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedJogos = [...jogos].sort((a, b) => {
      let valueA, valueB;
      
      if (key === 'titulo') {
        valueA = (a.titulo || '').toLowerCase();
        valueB = (b.titulo || '').toLowerCase();
      } else if (key === 'data') {
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
      }
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setJogos(sortedJogos);
    setSortConfig({ key, direction });
  };

  const handleCriarNovoJogo = () => {
    setJogoParaEditar(null);
    setMostrarForm(true);
  };

  const handleEditJogo = (jogo) => {
    setJogoParaEditar(jogo);
    setMostrarForm(true);
  };

  const handleViewJogo = async (jogo) => {
    try {
      // Buscar dados completos do jogo incluindo tabuleiro
      const response = await fetch(endpoints.jogo.getTabuleiro(jogo.id), {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setJogoParaVisualizar(data.jogo);
      }
    } catch (err) {
      console.error('Erro ao carregar jogo:', err);
    }
  };

  const handleDeleteClick = (jogo) => {
    if (jogo._count?.partidas > 0) {
      return;
    }
    setJogoParaDeletar(jogo);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!jogoParaDeletar) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(endpoints.jogo.delete(jogoParaDeletar.id), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar jogo');
      }

      await carregarJogos();
      setShowDeleteModal(false);
      setJogoParaDeletar(null);
    } catch (err) {
      console.error('Erro ao deletar jogo:', err);
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (jogoParaEditar) {
        // Editando jogo existente - apenas campos permitidos
        const response = await fetch(endpoints.jogo.update(jogoParaEditar.id), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            titulo: formData.titulo,
            descricao: formData.descricao,
            dificuldade: formData.dificuldade,
            ativo: formData.ativo
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao atualizar jogo');
        }
      } else {
        // Criando novo jogo
        const response = await fetch(endpoints.jogo.create, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao criar jogo');
        }
      }

      await carregarJogos();
      setMostrarForm(false);
      setJogoParaEditar(null);
    } catch (err) {
      console.error('Erro ao salvar jogo:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setJogoParaEditar(null);
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando jogos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        <div className="content-header">
          <div className="header-left">
            <h1 className="content-title">Meus Jogos</h1>
            <p className="content-subtitle">Crie e gerencie seus jogos de caça-palavras</p>
          </div>
          <button className="btn-primary" onClick={handleCriarNovoJogo}>
            <Plus size={20} />
            Novo Jogo
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>Erro ao carregar jogos: {error}</p>
          </div>
        )}

        <div className="content-toolbar">
          <div className="sort-buttons">
            <button 
              className={`btn-sort ${sortConfig.key === 'titulo' ? 'active' : ''}`}
              onClick={() => handleSort('titulo')}
            >
              <ArrowUpDown size={16} />
              Nome
              {sortConfig.key === 'titulo' && (
                <span className="sort-indicator">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <button 
              className={`btn-sort ${sortConfig.key === 'data' ? 'active' : ''}`}
              onClick={() => handleSort('data')}
            >
              <Calendar size={16} />
              Data
              {sortConfig.key === 'data' && (
                <span className="sort-indicator">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        </div>

        {jogos.length === 0 ? (
          <div className="empty-state">
            <Gamepad2 size={64} />
            <p>Nenhum jogo criado ainda</p>
            <button className="btn-primary" onClick={handleCriarNovoJogo}>
              <Plus size={20} />
              Criar primeiro jogo
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {jogos.map(jogo => (
              <JogoCard
                key={jogo.id}
                jogo={jogo}
                onEdit={handleEditJogo}
                onDelete={handleDeleteClick}
                onView={handleViewJogo}
              />
            ))}
          </div>
        )}
      </div>

      {mostrarForm && (
        <JogoForm
          jogo={jogoParaEditar}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {jogoParaVisualizar && (
        <VisualizarJogo
          jogo={jogoParaVisualizar}
          onClose={() => setJogoParaVisualizar(null)}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setJogoParaDeletar(null);
        }}
        title="Excluir Jogo"
        message={`Tem certeza que deseja excluir o jogo "${jogoParaDeletar?.titulo}"? Esta ação não pode ser desfeita.`}
        confirmText={deleteLoading ? "Excluindo..." : "Excluir"}
        cancelText="Cancelar"
        icon={Trash2}
        variant="danger"
      />
    </div>
  );
}
