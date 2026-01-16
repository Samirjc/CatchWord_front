import { useState, useEffect } from 'react';
import { X, Gamepad2, Calendar } from 'lucide-react';
import { endpoints } from '../../../services/API/api';
import { Toast } from '../../../components/Toast/Toast';
import './styles/CriarPartida.css';

const DIFICULDADE_CORES = {
  FACIL: { bg: '#dcfce7', color: '#166534' },
  MEDIO: { bg: '#fef3c7', color: '#92400e' },
  DIFICIL: { bg: '#fee2e2', color: '#991b1b' },
};

const DIFICULDADE_LABELS = {
  FACIL: 'Fácil',
  MEDIO: 'Médio',
  DIFICIL: 'Difícil',
};

export function CriarPartida({ turma, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    jogoId: null,
    inicio: '',
    fim: ''
  });
  
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJogos, setLoadingJogos] = useState(true);
  const [erro, setErro] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Carregar jogos do professor
  useEffect(() => {
    const carregarJogos = async () => {
      try {
        setLoadingJogos(true);
        const response = await fetch(endpoints.jogo.list, {
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar jogos');
        }

        const data = await response.json();
        // A API retorna { success: true, jogos: [...] }
        const jogosArray = data.jogos || data || [];
        setJogos(jogosArray.filter(j => j.ativo));
      } catch (err) {
        console.error('Erro ao carregar jogos:', err);
        setErro('Erro ao carregar seus jogos');
      } finally {
        setLoadingJogos(false);
      }
    };

    carregarJogos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJogoSelect = (jogoId) => {
    setFormData(prev => ({
      ...prev,
      jogoId: prev.jogoId === jogoId ? null : jogoId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!formData.nome.trim()) {
      setErro('O nome da partida é obrigatório');
      return;
    }

    if (!formData.jogoId) {
      setErro('Selecione um jogo para a partida');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(endpoints.partida.create, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: formData.nome,
          jogoId: formData.jogoId,
          turmaId: turma.id,
          inicio: formData.inicio || null,
          fim: formData.fim || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar partida');
      }

      const partida = await response.json();
      onSave(partida);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const jogoSelecionado = jogos.find(j => j.id === formData.jogoId);

  return (
    <div className="criar-partida-overlay">
      <div className="criar-partida-container">
        <div className="criar-partida-header">
          <div>
            <h2>Criar Nova Partida</h2>
            <p className="header-subtitle">Turma: {turma.disciplina}</p>
          </div>
          <button type="button" className="btn-close" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>        {/* Toast para mensagens de erro */}
        <Toast 
          mensagem={erro} 
          tipo="erro" 
          onClose={() => setErro('')}
          duracao={5000}
        />

        <form onSubmit={handleSubmit} className="criar-partida-form">
          <div className="form-group">
            <label htmlFor="nome">Nome da Partida *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Ex: Revisão para Prova"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="inicio">
                <Calendar size={16} />
                Data de Início (opcional)
              </label>
              <input
                type="datetime-local"
                id="inicio"
                name="inicio"
                value={formData.inicio}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fim">
                <Calendar size={16} />
                Data de Encerramento (opcional)
              </label>
              <input
                type="datetime-local"
                id="fim"
                name="fim"
                value={formData.fim}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Gamepad2 size={16} />
              Selecione um Jogo *
            </label>

            {loadingJogos ? (
              <div className="loading-jogos">Carregando seus jogos...</div>
            ) : jogos.length === 0 ? (
              <div className="empty-jogos">
                <p>Você ainda não tem jogos criados.</p>
                <p>Crie um jogo primeiro na aba "Jogos".</p>
              </div>
            ) : (
              <div className="jogos-grid">
                {jogos.map((jogo) => {
                  const dificuldadeCor = DIFICULDADE_CORES[jogo.dificuldade] || DIFICULDADE_CORES.FACIL;
                  const isSelected = formData.jogoId === jogo.id;

                  return (
                    <div
                      key={jogo.id}
                      className={`jogo-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleJogoSelect(jogo.id)}
                    >
                      <div className="jogo-card-header">
                        <h4>{jogo.titulo}</h4>
                        <span
                          className="dificuldade-badge"
                          style={{ backgroundColor: dificuldadeCor.bg, color: dificuldadeCor.color }}
                        >
                          {DIFICULDADE_LABELS[jogo.dificuldade]}
                        </span>
                      </div>
                      <div className="jogo-card-body">
                        <span className="jogo-tema">{jogo.tema}</span>
                        <span className="jogo-dimensoes">{jogo.largura}x{jogo.altura}</span>
                        <span className="jogo-palavras">{jogo._count?.palavras || jogo.palavras?.length || 0} palavras</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {jogoSelecionado && (
            <div className="jogo-preview">
              <h4>Jogo Selecionado</h4>
              <p><strong>{jogoSelecionado.titulo}</strong> - {jogoSelecionado.tema}</p>
              {jogoSelecionado.descricao && <p>{jogoSelecionado.descricao}</p>}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading || !formData.jogoId}
            >
              {loading ? 'Criando...' : 'Criar Partida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
