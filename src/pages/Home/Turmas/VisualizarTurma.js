import { useState, useEffect, useCallback } from 'react';
import { X, Users, Gamepad2, Clock, User, Mail, Calendar, Play, ChevronRight, Plus, Trash2, CheckCircle, Trophy, Medal, Award } from 'lucide-react';
import { endpoints } from '../../../services/API/api';
import { CriarPartida } from './CriarPartida';
import { JogarPartida } from './JogarPartida';
import './styles/VisualizarTurma.css';

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

function AlunoCard({ aluno }) {
  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="aluno-card">
      <div className="aluno-avatar">
        <User size={24} />
      </div>
      <div className="aluno-info">
        <h4 className="aluno-nome">{aluno.nome}</h4>
        <div className="aluno-detalhes">
          <span className="aluno-email">
            <Mail size={14} />
            {aluno.email}
          </span>
          <span className="aluno-matricula">
            <Calendar size={14} />
            Desde {formatarData(aluno.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Componente de Ranking de uma partida
function RankingPartida({ partida, onClose }) {
  const [estatisticas, setEstatisticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(endpoints.partida.getEstatisticas(partida.id), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEstatisticas(data);
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarEstatisticas();
  }, [partida.id]);

  const formatarTempo = (inicio, fim) => {
    if (!inicio || !fim) return '-';
    const segundos = Math.floor((new Date(fim) - new Date(inicio)) / 1000);
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMedalha = (posicao) => {
    switch (posicao) {
      case 1:
        return <Medal size={24} className="medalha ouro" />;
      case 2:
        return <Medal size={24} className="medalha prata" />;
      case 3:
        return <Medal size={24} className="medalha bronze" />;
      default:
        return <span className="posicao-numero">{posicao}º</span>;
    }
  };

  return (
    <div className="ranking-overlay">
      <div className="ranking-container">
        <div className="ranking-header">
          <div className="ranking-title">
            <Trophy size={24} />
            <div>
              <h2>Ranking</h2>
              <span className="ranking-partida-nome">{partida.nome}</span>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="ranking-content">
          {loading ? (
            <div className="ranking-loading">
              <p>Carregando ranking...</p>
            </div>
          ) : estatisticas.length === 0 ? (
            <div className="ranking-empty">
              <Award size={48} />
              <p>Nenhum aluno jogou esta partida ainda</p>
            </div>
          ) : (
            <>
              {/* Pódio para os 3 primeiros */}
              {estatisticas.length >= 1 && (
                <div className="ranking-podio">
                  {estatisticas.length >= 2 && (
                    <div className="podio-item segundo">
                      <div className="podio-avatar">
                        <User size={28} />
                      </div>
                      <Medal size={32} className="medalha prata" />
                      <span className="podio-nome">{estatisticas[1].aluno.nome}</span>
                      <span className="podio-pontos">{estatisticas[1].pontuacao} pts</span>
                    </div>
                  )}
                  <div className="podio-item primeiro">
                    <div className="podio-avatar">
                      <User size={36} />
                    </div>
                    <Medal size={40} className="medalha ouro" />
                    <span className="podio-nome">{estatisticas[0].aluno.nome}</span>
                    <span className="podio-pontos">{estatisticas[0].pontuacao} pts</span>
                  </div>
                  {estatisticas.length >= 3 && (
                    <div className="podio-item terceiro">
                      <div className="podio-avatar">
                        <User size={24} />
                      </div>
                      <Medal size={28} className="medalha bronze" />
                      <span className="podio-nome">{estatisticas[2].aluno.nome}</span>
                      <span className="podio-pontos">{estatisticas[2].pontuacao} pts</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tabela completa */}
              <div className="ranking-tabela">
                <div className="ranking-tabela-header">
                  <span className="col-posicao">Pos.</span>
                  <span className="col-nome">Aluno</span>
                  <span className="col-palavras">Palavras</span>
                  <span className="col-tempo">Tempo</span>
                  <span className="col-pontos">Pontos</span>
                </div>
                <div className="ranking-tabela-body">
                  {estatisticas.map((est, index) => (
                    <div key={est.id} className={`ranking-row ${index < 3 ? `top-${index + 1}` : ''}`}>
                      <span className="col-posicao">{getMedalha(index + 1)}</span>
                      <span className="col-nome">
                        <User size={16} />
                        {est.aluno.nome}
                      </span>
                      <span className="col-palavras">{est.palavrasAchadas}</span>
                      <span className="col-tempo">{formatarTempo(est.inicio, est.fim)}</span>
                      <span className="col-pontos">{est.pontuacao}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ranking-footer">
          <button className="btn-fechar-ranking" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function PartidaCard({ partida, onJogar, onDelete, onRanking, userProfile, jaJogou }) {
  const formatarDataHora = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar status baseado nas datas
  const agora = new Date();
  const dataInicio = partida.inicio ? new Date(partida.inicio) : null;
  const dataFim = partida.fim ? new Date(partida.fim) : null;
  const isEncerrada = dataFim && dataFim < agora;
  const naoIniciada = dataInicio && dataInicio > agora;
  
  // Pegar dificuldade do jogo associado
  const dificuldade = partida.jogo?.dificuldade || 'FACIL';
  const dificuldadeCor = DIFICULDADE_CORES[dificuldade] || DIFICULDADE_CORES.FACIL;  const isProfessor = userProfile === 'professor';
  const isCoordenador = userProfile === 'coordenador';
  const canDelete = (isProfessor || isCoordenador) && partida._count?.estatisticas === 0;
  const hasEstatisticas = partida._count?.estatisticas > 0;
  const isAluno = userProfile === 'aluno';

  return (
    <div className={`partida-card ${isEncerrada ? 'encerrada' : ''} ${naoIniciada ? 'nao-iniciada' : ''} ${jaJogou ? 'ja-jogou' : ''}`}>
      <div className="partida-header">
        <h4 className="partida-titulo">{partida.nome}</h4>
        <div className="partida-badges">
          <span 
            className="dificuldade-badge"
            style={{ backgroundColor: dificuldadeCor.bg, color: dificuldadeCor.color }}
          >
            {DIFICULDADE_LABELS[dificuldade]}
          </span>
          {canDelete && (
            <button 
              className="btn-delete-partida" 
              onClick={(e) => { e.stopPropagation(); onDelete(partida); }}
              title="Excluir partida"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="partida-body">
        <div className="partida-info">
          <span className="partida-tema">
            <Gamepad2 size={16} />
            {partida.jogo?.titulo || 'Jogo'}
          </span>
          <span className="partida-tema-secundario">
            {partida.jogo?.tema}
          </span>
          {partida.inicio && (
            <span className="partida-data">
              <Calendar size={16} />
              {naoIniciada ? 'Inicia em' : 'Iniciou em'} {formatarDataHora(partida.inicio)}
            </span>
          )}
          {partida.fim && (
            <span className="partida-data">
              <Clock size={16} />
              {isEncerrada ? 'Encerrada em' : 'Até'} {formatarDataHora(partida.fim)}
            </span>
          )}
          {partida._count?.estatisticas > 0 && (
            <span className="partida-jogadas">
              <Users size={16} />
              {partida._count.estatisticas} jogada(s)
            </span>
          )}
        </div>
      </div>      <div className="partida-footer">
        {/* Botão de Ranking - sempre visível */}
        <button className="btn-ranking" onClick={() => onRanking(partida)}>
          <Trophy size={16} />
          Ver Ranking
        </button>
        
        {isEncerrada ? (
          <span className="status-badge encerrada">
            Partida Encerrada
          </span>
        ) : naoIniciada ? (
          <span className="status-badge nao-iniciada">
            <Clock size={16} />
            Aguardando Início
          </span>
        ) : isAluno ? (
          jaJogou ? (
            <span className="status-badge ja-jogou">
              <CheckCircle size={16} />
              Já Jogado
            </span>
          ) : (
            <button className="btn-jogar" onClick={() => onJogar(partida)}>
              <Play size={16} />
              Jogar Agora
            </button>
          )
        ) : (
          <button className="btn-ver-resultados" onClick={() => onJogar(partida)}>
            <ChevronRight size={16} />
            Ver Detalhes
          </button>
        )}
      </div>
    </div>
  );
}

export function VisualizarTurma({ turma, onClose, userProfile }) {
  const [abaAtiva, setAbaAtiva] = useState('alunos');
  const [partidas, setPartidas] = useState([]);
  const [loadingPartidas, setLoadingPartidas] = useState(false);
  const [mostrarCriarPartida, setMostrarCriarPartida] = useState(false);
  const [partidaParaJogar, setPartidaParaJogar] = useState(null);
  const [partidaParaRanking, setPartidaParaRanking] = useState(null);
  const [partidasJogadas, setPartidasJogadas] = useState({}); // {partidaId: boolean}

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  // Verificar quais partidas o aluno já jogou
  const verificarPartidasJogadas = useCallback(async (listaPartidas) => {
    if (userProfile !== 'aluno' || listaPartidas.length === 0) return;

    const jogadas = {};
    
    // Verificar cada partida se o aluno já jogou
    await Promise.all(listaPartidas.map(async (partida) => {
      try {
        const response = await fetch(endpoints.partida.getMinhaEstatistica(partida.id), {
          headers: getAuthHeaders()
        });
        
        if (response.ok) {
          const estatistica = await response.json();
          jogadas[partida.id] = estatistica !== null && estatistica !== undefined;
        }
      } catch (err) {
        console.error('Erro ao verificar estatística:', err);
      }
    }));

    setPartidasJogadas(jogadas);
  }, [userProfile, getAuthHeaders]);
  // Carregar partidas da turma
  const carregarPartidas = useCallback(async () => {
    if (!turma) return;
    
    try {
      setLoadingPartidas(true);
      const response = await fetch(endpoints.partida.getByTurma(turma.id), {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setPartidas(data);
        // Verificar quais o aluno já jogou
        await verificarPartidasJogadas(data);
      }
    } catch (err) {
      console.error('Erro ao carregar partidas:', err);
    } finally {
      setLoadingPartidas(false);
    }
  }, [turma, getAuthHeaders, verificarPartidasJogadas]);

  // Carregar partidas ao montar o componente (para mostrar contador correto)
  useEffect(() => {
    carregarPartidas();
  }, [carregarPartidas]);

  if (!turma) return null;

  // Extrair alunos da estrutura TurmaAluno
  const alunos = turma.alunos?.map(ta => ta.aluno) || [];

  const handleJogar = (partida) => {
    setPartidaParaJogar(partida);
  };

  const handleRanking = (partida) => {
    setPartidaParaRanking(partida);
  };

  const handleCriarPartida = async (novaPartida) => {
    setMostrarCriarPartida(false);
    await carregarPartidas();
  };

  const handleDeletePartida = async (partida) => {
    if (!window.confirm(`Tem certeza que deseja excluir a partida "${partida.nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(endpoints.partida.delete(partida.id), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        await carregarPartidas();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao excluir partida');
      }
    } catch (err) {
      console.error('Erro ao excluir partida:', err);
      alert('Erro ao excluir partida');
    }
  };

  const isProfessor = userProfile === 'professor';
  const isCoordenador = userProfile === 'coordenador';
  const canCreatePartida = isProfessor || isCoordenador;

  return (
    <div className="visualizar-turma-overlay">
      <div className="visualizar-turma-container">
        <div className="visualizar-turma-header">
          <div className="turma-info-header">
            <h2>{turma.disciplina}</h2>
            <div className="turma-meta">
              <span className="turma-codigo">Código: {turma.codigo}</span>
              {turma.professor && (
                <span className="turma-professor">
                  <User size={14} />
                  Prof. {turma.professor.nome}
                </span>
              )}
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="turma-tabs">
          <button 
            className={`tab-btn ${abaAtiva === 'alunos' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('alunos')}
          >
            <Users size={18} />
            Alunos
            <span className="tab-count">{alunos.length}</span>
          </button>
          <button 
            className={`tab-btn ${abaAtiva === 'partidas' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('partidas')}
          >
            <Gamepad2 size={18} />
            Partidas
            <span className="tab-count">{partidas.length}</span>
          </button>
        </div>

        <div className="visualizar-turma-content">
          {abaAtiva === 'alunos' && (
            <div className="alunos-section">
              {alunos.length > 0 ? (
                <div className="alunos-list">
                  {alunos.map((aluno) => (
                    <AlunoCard key={aluno.id} aluno={aluno} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Users size={48} />
                  <p>Nenhum aluno matriculado nesta turma</p>
                </div>
              )}
            </div>
          )}

          {abaAtiva === 'partidas' && (
            <div className="partidas-section">
              {canCreatePartida && (
                <div className="partidas-toolbar">
                  <button 
                    className="btn-criar-partida"
                    onClick={() => setMostrarCriarPartida(true)}
                  >
                    <Plus size={18} />
                    Criar Nova Partida
                  </button>
                </div>
              )}              {loadingPartidas ? (
                <div className="loading-state">
                  <p>Carregando partidas...</p>
                </div>
              ) : partidas.length > 0 ? (
                <div className="partidas-list">
                  {partidas.map((partida) => (
                    <PartidaCard 
                      key={partida.id} 
                      partida={partida} 
                      onJogar={handleJogar}
                      onDelete={handleDeletePartida}
                      onRanking={handleRanking}
                      userProfile={userProfile}
                      jaJogou={partidasJogadas[partida.id]}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Gamepad2 size={48} />
                  <p>Nenhuma partida disponível para esta turma</p>
                  {canCreatePartida && (
                    <button 
                      className="btn-criar-partida-empty"
                      onClick={() => setMostrarCriarPartida(true)}
                    >
                      <Plus size={18} />
                      Criar Primeira Partida
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mostrarCriarPartida && (
        <CriarPartida
          turma={turma}
          onSave={handleCriarPartida}
          onCancel={() => setMostrarCriarPartida(false)}
        />
      )}      {partidaParaJogar && (
        <JogarPartida
          partida={partidaParaJogar}
          onClose={() => setPartidaParaJogar(null)}
          onFinish={carregarPartidas}
          userProfile={userProfile}
        />
      )}

      {partidaParaRanking && (
        <RankingPartida
          partida={partidaParaRanking}
          onClose={() => setPartidaParaRanking(null)}
        />
      )}
    </div>
  );
}
