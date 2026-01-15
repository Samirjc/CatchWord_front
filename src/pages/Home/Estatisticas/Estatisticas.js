import { useState, useEffect } from 'react';
import { Trophy, Users, BarChart3, Calendar, ChevronRight, Award, Clock, ArrowLeft } from 'lucide-react';
import { endpoints } from '../../../services/API/api';
import './styles/Estatisticas.css';

// Componente para card de turma
function TurmaCard({ turma, onClick }) {
  const numPartidas = turma.partidas?.length || 0;
  const numAlunos = turma._count?.alunos || 0;

  return (
    <div className="turma-card" onClick={onClick}>
      <div className="turma-header">
        <div className="turma-icon">
          <Users size={24} />
        </div>
        <div className="turma-info">
          <h3 className="turma-codigo">{turma.codigo}</h3>
          <p className="turma-disciplina">{turma.disciplina}</p>
        </div>
        <ChevronRight size={20} className="turma-arrow" />
      </div>
      <div className="turma-stats">
        <div className="turma-stat-item">
          <BarChart3 size={16} />
          <span>{numPartidas} partida{numPartidas !== 1 ? 's' : ''}</span>
        </div>
        <div className="turma-stat-item">
          <Users size={16} />
          <span>{numAlunos} aluno{numAlunos !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}

// Componente para card de partida (dentro da turma)
function PartidaListCard({ partida, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'CRIADA': '#6b7280',
      'INICIADA': '#3b82f6',
      'FINALIZADA': '#059669'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'CRIADA': 'Criada',
      'INICIADA': 'Em andamento',
      'FINALIZADA': 'Finalizada'
    };
    return labels[status] || status;
  };

  const numParticipantes = partida._count?.estatisticas || 0;

  return (
    <div className="partida-list-card" onClick={onClick}>
      <div className="partida-list-header">
        <div>
          <h4 className="partida-list-nome">{partida.nome}</h4>
          <p className="partida-list-data">
            <Calendar size={14} />
            {formatDate(partida.createdAt)}
          </p>
        </div>
        <div className="partida-list-right">
          <span 
            className="partida-status-badge" 
            style={{ backgroundColor: `${getStatusColor(partida.status)}15`, color: getStatusColor(partida.status) }}
          >
            {getStatusLabel(partida.status)}
          </span>
          <ChevronRight size={18} className="partida-arrow" />
        </div>
      </div>
      <div className="partida-list-footer">
        <div className="partida-list-info">
          <Users size={14} />
          <span>{numParticipantes} participante{numParticipantes !== 1 ? 's' : ''}</span>
        </div>
        {partida.jogo && (
          <div className="partida-list-info">
            <Trophy size={14} />
            <span>{partida.jogo.titulo}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para ranking de alunos
function RankingCard({ posicao, aluno, pontos, palavrasAchadas, tempoTotal }) {
  const getMedalColor = (pos) => {
    if (pos === 1) return '#FFD700'; // Ouro
    if (pos === 2) return '#C0C0C0'; // Prata
    if (pos === 3) return '#CD7F32'; // Bronze
    return '#6b7280';
  };

  const formatTempo = (inicio, fim) => {
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
    const segundos = Math.floor((fimDate - inicioDate) / 1000);
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="ranking-card">
      <div className="ranking-posicao" style={{ color: getMedalColor(posicao) }}>
        {posicao <= 3 ? <Trophy size={20} /> : <span>#{posicao}</span>}
      </div>
      <div className="ranking-info">
        <p className="ranking-nome">{aluno.nome}</p>
        <div className="ranking-detalhes">
          <span className="ranking-detail-item">
            <Award size={12} />
            {palavrasAchadas} palavra{palavrasAchadas !== 1 ? 's' : ''}
          </span>
          {tempoTotal && (
            <span className="ranking-detail-item">
              <Clock size={12} />
              {formatTempo(tempoTotal.inicio, tempoTotal.fim)}
            </span>
          )}
        </div>
      </div>
      <div className="ranking-pontos">
        <span className="ranking-pontos-valor">{pontos}</span>
        <span className="ranking-pontos-label">pts</span>
      </div>
    </div>
  );
}

// Componente Principal
export function EstatisticasContent({ userProfile }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [partidaSelecionada, setPartidaSelecionada] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    carregarTurmas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoints.turma.list, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar turmas');
      }

      const data = await response.json();
      
      // Buscar partidas para cada turma
      const turmasComPartidas = await Promise.all(
        data.map(async (turma) => {
          try {
            // TODO: Implementar endpoint para buscar partidas por turma
            // Por enquanto, usando dados mock
            return {
              ...turma,
              partidas: gerarPartidasMock(turma.id)
            };
          } catch (err) {
            console.error(`Erro ao carregar partidas da turma ${turma.id}:`, err);
            return { ...turma, partidas: [] };
          }
        })
      );

      setTurmas(turmasComPartidas);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar turmas:', err);
    } finally {
      setLoading(false);
    }
  };

  const carregarRanking = async (partidaId) => {
    try {
      setLoadingRanking(true);
      setError(null);

      // TODO: Implementar endpoint para buscar ranking da partida
      // Por enquanto, usando dados mock
      await new Promise(resolve => setTimeout(resolve, 500));
      const rankingMock = gerarRankingMock();
      setRanking(rankingMock);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar ranking:', err);
    } finally {
      setLoadingRanking(false);
    }
  };

  const gerarPartidasMock = (turmaId) => {
    return [
      {
        id: 1,
        nome: 'Partida - Vocabulário Português',
        status: 'FINALIZADA',
        createdAt: new Date('2026-01-10'),
        _count: { estatisticas: 25 },
        jogo: { titulo: 'Caça-Palavras Português' }
      },
      {
        id: 2,
        nome: 'Partida - Gramática Avançada',
        status: 'FINALIZADA',
        createdAt: new Date('2026-01-08'),
        _count: { estatisticas: 22 },
        jogo: { titulo: 'Caça-Palavras Gramática' }
      },
      {
        id: 3,
        nome: 'Partida - Literatura Brasileira',
        status: 'INICIADA',
        createdAt: new Date('2026-01-14'),
        _count: { estatisticas: 18 },
        jogo: { titulo: 'Caça-Palavras Literatura' }
      }
    ];
  };

  const gerarRankingMock = () => {
    return [
      {
        posicao: 1,
        aluno: { nome: 'Ana Costa' },
        pontos: 950,
        palavrasAchadas: 12,
        tempoTotal: { inicio: new Date('2026-01-10T10:00:00'), fim: new Date('2026-01-10T10:08:30') }
      },
      {
        posicao: 2,
        aluno: { nome: 'Pedro Lima' },
        pontos: 920,
        palavrasAchadas: 12,
        tempoTotal: { inicio: new Date('2026-01-10T10:00:00'), fim: new Date('2026-01-10T10:09:15') }
      },
      {
        posicao: 3,
        aluno: { nome: 'Julia Oliveira' },
        pontos: 890,
        palavrasAchadas: 11,
        tempoTotal: { inicio: new Date('2026-01-10T10:00:00'), fim: new Date('2026-01-10T10:09:45') }
      },
      {
        posicao: 4,
        aluno: { nome: 'Carlos Mendes' },
        pontos: 870,
        palavrasAchadas: 11,
        tempoTotal: { inicio: new Date('2026-01-10T10:00:00'), fim: new Date('2026-01-10T10:10:20') }
      },
      {
        posicao: 5,
        aluno: { nome: 'Beatriz Souza' },
        pontos: 850,
        palavrasAchadas: 10,
        tempoTotal: { inicio: new Date('2026-01-10T10:00:00'), fim: new Date('2026-01-10T10:10:50') }
      }
    ];
  };

  const handleSelecionarTurma = (turma) => {
    setTurmaSelecionada(turma);
    setPartidaSelecionada(null);
    setRanking([]);
  };

  const handleSelecionarPartida = (partida) => {
    setPartidaSelecionada(partida);
    carregarRanking(partida.id);
  };

  const handleVoltar = () => {
    if (partidaSelecionada) {
      setPartidaSelecionada(null);
      setRanking([]);
    } else if (turmaSelecionada) {
      setTurmaSelecionada(null);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando estatísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="error-container">
            <p className="error-message">Erro ao carregar dados: {error}</p>
            <button className="btn-retry" onClick={carregarTurmas}>
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Ranking da Partida
  if (partidaSelecionada) {
    return (
      <div className="main-content">
        <div className="content-wrapper estatisticas-container">
          <div className="page-header">
            <button className="btn-voltar" onClick={handleVoltar}>
              <ArrowLeft size={20} />
              Voltar
            </button>
            <div>
              <h1 className="content-title">{partidaSelecionada.nome}</h1>
              <p className="content-subtitle">
                Turma: {turmaSelecionada.codigo} - {turmaSelecionada.disciplina}
              </p>
            </div>
          </div>

          <div className="section-container">
            <div className="section-header">
              <div className="section-title">
                <Trophy size={24} />
                <h2>Ranking da Partida</h2>
              </div>
            </div>

            {loadingRanking ? (
              <div className="loading-container-small">
                <div className="spinner-small"></div>
                <p>Carregando ranking...</p>
              </div>
            ) : ranking.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum aluno participou desta partida ainda.</p>
              </div>
            ) : (
              <div className="ranking-list">
                {ranking.map((item) => (
                  <RankingCard
                    key={item.posicao}
                    posicao={item.posicao}
                    aluno={item.aluno}
                    pontos={item.pontos}
                    palavrasAchadas={item.palavrasAchadas}
                    tempoTotal={item.tempoTotal}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista de Partidas da Turma
  if (turmaSelecionada) {
    return (
      <div className="main-content">
        <div className="content-wrapper estatisticas-container">
          <div className="page-header">
            <button className="btn-voltar" onClick={handleVoltar}>
              <ArrowLeft size={20} />
              Voltar
            </button>
            <div>
              <h1 className="content-title">{turmaSelecionada.codigo}</h1>
              <p className="content-subtitle">{turmaSelecionada.disciplina}</p>
            </div>
          </div>

          <div className="section-container">
            <div className="section-header">
              <div className="section-title">
                <BarChart3 size={24} />
                <h2>Partidas da Turma</h2>
              </div>
            </div>

            {turmaSelecionada.partidas.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma partida encontrada para esta turma.</p>
              </div>
            ) : (
              <div className="partidas-list">
                {turmaSelecionada.partidas.map((partida) => (
                  <PartidaListCard
                    key={partida.id}
                    partida={partida}
                    onClick={() => handleSelecionarPartida(partida)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista Principal - Lista de Turmas
  return (
    <div className="main-content">
      <div className="content-wrapper estatisticas-container">
        <div className="page-header">
          <div>
            <h1 className="content-title">Estatísticas</h1>
            <p className="content-subtitle">
              {userProfile === 'aluno' && 'Veja o desempenho das suas turmas'}
              {userProfile === 'professor' && 'Acompanhe o desempenho das suas turmas'}
              {userProfile === 'coordenador' && 'Visão geral do desempenho das turmas'}
            </p>
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <div className="section-title">
              <Users size={24} />
              <h2>Turmas</h2>
            </div>
          </div>

          {turmas.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma turma encontrada.</p>
            </div>
          ) : (
            <div className="turmas-grid">
              {turmas.map((turma) => (
                <TurmaCard
                  key={turma.id}
                  turma={turma}
                  onClick={() => handleSelecionarTurma(turma)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
