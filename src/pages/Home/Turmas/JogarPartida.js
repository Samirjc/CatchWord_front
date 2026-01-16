import { useState, useEffect, useCallback } from 'react';
import { X, Trophy, Clock, CheckCircle, Sparkles, AlertTriangle, Eye } from 'lucide-react';
import { endpoints } from '../../../services/API/api';
import { Toast } from '../../../components/Toast/Toast';
import './styles/JogarPartida.css';

export function JogarPartida({ partida, onClose, onFinish, userProfile }) {
  const [jogo, setJogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [jaJogou, setJaJogou] = useState(false);
  const [estatisticaAnterior, setEstatisticaAnterior] = useState(null);
  const [mostrarAlertaSaida, setMostrarAlertaSaida] = useState(false);
  
  // Estado do jogo
  const [selecaoAtual, setSelecaoAtual] = useState([]);
  const [palavrasEncontradas, setPalavrasEncontradas] = useState([]);
  const [celulasEncontradas, setCelulasEncontradas] = useState({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempoInicio, setTempoInicio] = useState(null);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [jogoIniciado, setJogoIniciado] = useState(false);

  // Verificar se é professor ou coordenador (modo visualização)
  const isModoVisualizacao = userProfile === 'professor' || userProfile === 'coordenador';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };  // Carregar dados da partida e verificar se já jogou
  useEffect(() => {
    const carregarPartida = async () => {
      try {
        setLoading(true);
        
        // Professor/Coordenador: apenas carregar para visualização
        if (isModoVisualizacao) {
          const response = await fetch(endpoints.partida.getById(partida.id), {
            headers: getAuthHeaders()
          });

          if (!response.ok) {
            throw new Error('Erro ao carregar partida');
          }

          const data = await response.json();
          setJogo(data.jogo);
          setLoading(false);
          return;
        }
        
        // Aluno: verificar se já jogou esta partida
        const estatisticaResponse = await fetch(endpoints.partida.getMinhaEstatistica(partida.id), {
          headers: getAuthHeaders()
        });
        
        if (estatisticaResponse.ok) {
          const estatistica = await estatisticaResponse.json();
          if (estatistica) {
            setJaJogou(true);
            setEstatisticaAnterior(estatistica);
            setLoading(false);
            return; // Não carregar o jogo se já jogou
          }
        }
        
        // Se não jogou, carregar dados da partida
        const response = await fetch(endpoints.partida.getById(partida.id), {
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          // Tratar erros específicos de período
          if (errorData.code === 'PARTIDA_NAO_INICIADA') {
            const dataInicio = new Date(errorData.inicio).toLocaleString('pt-BR');
            throw new Error(`Esta partida ainda não começou. Início: ${dataInicio}`);
          }
          
          if (errorData.code === 'PARTIDA_ENCERRADA') {
            const dataFim = new Date(errorData.fim).toLocaleString('pt-BR');
            throw new Error(`Esta partida já foi encerrada em ${dataFim}`);
          }
          
          throw new Error(errorData.error || 'Erro ao carregar partida');
        }

        const data = await response.json();
        setJogo(data.jogo);
        setTempoInicio(Date.now());
        setJogoIniciado(true);
      } catch (err) {
        console.error('Erro ao carregar partida:', err);
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarPartida();
  }, [partida.id, isModoVisualizacao]);

  // Timer
  useEffect(() => {
    if (!tempoInicio || jogoFinalizado) return;

    const interval = setInterval(() => {
      setTempoDecorrido(Math.floor((Date.now() - tempoInicio) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoInicio, jogoFinalizado]);
  // Verificar se encontrou todas as palavras
  useEffect(() => {
    if (jogo && palavrasEncontradas.length === jogo.palavras.length && !jogoFinalizado) {
      finalizarJogo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palavrasEncontradas, jogo]);

  // Handler para fechar o jogo
  const handleCloseClick = () => {
    // Se o jogo foi iniciado e não foi finalizado, mostrar alerta
    if (jogoIniciado && !jogoFinalizado) {
      setMostrarAlertaSaida(true);
    } else {
      onClose();
    }
  };
  // Confirmar saída (salva pontuação atual)
  const confirmarSaida = async () => {
    // Registrar estatística com pontuação parcial (o que conseguiu até o momento)
    if (tempoInicio && palavrasEncontradas.length >= 0) {
      try {
        const pontuacaoAtual = calcularPontuacao();
        await fetch(endpoints.partida.registrarEstatistica(partida.id), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            pontuacao: pontuacaoAtual, // Pontuação que tinha quando saiu
            palavrasAchadas: palavrasEncontradas.length,
            inicio: new Date(tempoInicio).toISOString(),
            fim: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error('Erro ao registrar estatística parcial:', err);
      }
    }
    onFinish?.();
    onClose();
  };

  // Cancelar saída
  const cancelarSaida = () => {
    setMostrarAlertaSaida(false);
  };

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calcularPontuacao = useCallback(() => {
    if (!jogo) return 0;
    
    const basePorPalavra = 100;
    const bonusTempo = Math.max(0, 300 - tempoDecorrido) * 2; // Bonus por terminar rápido
    const totalPalavras = palavrasEncontradas.length * basePorPalavra;
    
    return totalPalavras + bonusTempo;
  }, [jogo, palavrasEncontradas.length, tempoDecorrido]);

  const finalizarJogo = async () => {
    setJogoFinalizado(true);
    const pontos = calcularPontuacao();
    setPontuacao(pontos);

    try {
      await fetch(endpoints.partida.registrarEstatistica(partida.id), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pontuacao: pontos,
          palavrasAchadas: palavrasEncontradas.length,
          inicio: new Date(tempoInicio).toISOString(),
          fim: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Erro ao registrar estatística:', err);
    }
  };

  // Verificar se a seleção forma uma palavra válida
  const verificarSelecao = useCallback((celulas) => {
    if (!jogo || celulas.length < 2) return null;

    // Extrair a string das células selecionadas
    const textoSelecionado = celulas.map(c => {
      const [linha, coluna] = c.split('-').map(Number);
      return jogo.tabuleiro[linha][coluna];
    }).join('');

    // Verificar se corresponde a alguma palavra (normal ou invertida)
    for (const palavraObj of jogo.palavras) {
      const palavra = palavraObj.palavra.toUpperCase();
      const palavraInvertida = palavra.split('').reverse().join('');

      if (textoSelecionado === palavra || textoSelecionado === palavraInvertida) {
        // Verificar se a seleção está na posição correta
        const primeiraCell = celulas[0].split('-').map(Number);
        const ultimaCell = celulas[celulas.length - 1].split('-').map(Number);

        const matchNormal = (
          (primeiraCell[0] === palavraObj.linhaInicio && primeiraCell[1] === palavraObj.colunaInicio &&
           ultimaCell[0] === palavraObj.linhaFim && ultimaCell[1] === palavraObj.colunaFim)
        );

        const matchInvertido = (
          (primeiraCell[0] === palavraObj.linhaFim && primeiraCell[1] === palavraObj.colunaFim &&
           ultimaCell[0] === palavraObj.linhaInicio && ultimaCell[1] === palavraObj.colunaInicio)
        );

        if (matchNormal || matchInvertido) {
          return palavraObj;
        }
      }
    }

    return null;
  }, [jogo]);

  const handleMouseDown = (linha, coluna) => {
    if (jogoFinalizado) return;
    setIsSelecting(true);
    setSelecaoAtual([`${linha}-${coluna}`]);
  };
  const handleMouseEnter = (linha, coluna) => {
    if (!isSelecting || jogoFinalizado) return;

    // Verificar se a célula está em linha reta com a seleção
    if (selecaoAtual.length > 0) {
      const [primeiraLinha, primeiraColuna] = selecaoAtual[0].split('-').map(Number);
      const deltaLinha = linha - primeiraLinha;
      const deltaColuna = coluna - primeiraColuna;

      // Só permitir horizontal, vertical ou diagonal
      const isHorizontal = deltaLinha === 0;
      const isVertical = deltaColuna === 0;
      const isDiagonal = Math.abs(deltaLinha) === Math.abs(deltaColuna);

      if (!isHorizontal && !isVertical && !isDiagonal) return;

      // Reconstruir seleção do início até esta célula
      const novaSelecao = [selecaoAtual[0]];
      const steps = Math.max(Math.abs(deltaLinha), Math.abs(deltaColuna));
      const stepLinha = steps === 0 ? 0 : deltaLinha / steps;
      const stepColuna = steps === 0 ? 0 : deltaColuna / steps;

      for (let i = 1; i <= steps; i++) {
        const l = primeiraLinha + Math.round(stepLinha * i);
        const c = primeiraColuna + Math.round(stepColuna * i);
        novaSelecao.push(`${l}-${c}`);
      }

      setSelecaoAtual(novaSelecao);
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting || jogoFinalizado) return;
    setIsSelecting(false);

    // Verificar se a seleção forma uma palavra
    const palavraEncontrada = verificarSelecao(selecaoAtual);

    if (palavraEncontrada && !palavrasEncontradas.includes(palavraEncontrada.palavra)) {
      setPalavrasEncontradas(prev => [...prev, palavraEncontrada.palavra]);
      
      // Marcar células como encontradas
      const novasCelulas = { ...celulasEncontradas };
      selecaoAtual.forEach(cell => {
        novasCelulas[cell] = true;
      });
      setCelulasEncontradas(novasCelulas);
    }    setSelecaoAtual([]);
  };

  const getCellClass = (linha, coluna) => {
    const cellKey = `${linha}-${coluna}`;
    const classes = ['jogo-cell'];

    if (celulasEncontradas[cellKey]) {
      classes.push('encontrada');
    }
    if (selecaoAtual.includes(cellKey)) {
      classes.push('selecionada');
    }

    return classes.join(' ');
  };

  if (loading) {
    return (
      <div className="jogar-partida-overlay">
        <div className="jogar-partida-container loading">
          <p>Carregando jogo...</p>
        </div>
      </div>
    );
  }  if (erro) {
    return (
      <div className="jogar-partida-overlay">
        <div className="jogar-partida-container erro">
          <p>{erro}</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  // Tela de "já jogou"
  if (jaJogou && estatisticaAnterior) {
    return (
      <div className="jogar-partida-overlay">
        <div className="jogar-partida-container ja-jogou-container">
          <div className="ja-jogou-content">
            <AlertTriangle size={64} className="icone-alerta" />
            <h2>Você já jogou esta partida!</h2>
            <p>Cada aluno pode jogar apenas uma vez.</p>
            
            <div className="resultado-anterior">
              <h3>Seu resultado:</h3>
              <div className="resultado-stats">
                <div className="resultado-item">
                  <Trophy size={24} />
                  <span>Pontuação: {estatisticaAnterior.pontuacao}</span>
                </div>
                <div className="resultado-item">
                  <CheckCircle size={24} />
                  <span>Palavras: {estatisticaAnterior.palavrasAchadas}</span>
                </div>
                {estatisticaAnterior.inicio && estatisticaAnterior.fim && (
                  <div className="resultado-item">
                    <Clock size={24} />
                    <span>Tempo: {formatarTempo(Math.floor((new Date(estatisticaAnterior.fim) - new Date(estatisticaAnterior.inicio)) / 1000))}</span>
                  </div>
                )}
              </div>
            </div>
            
            <button className="btn-fechar" onClick={onClose}>
              Voltar para Turma
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!jogo) return null;

  // Função para obter todas as células de uma palavra
  const getCelulasVisualizacao = (palavraObj) => {
    const celulas = [];
    const deltaLinha = palavraObj.linhaFim - palavraObj.linhaInicio;
    const deltaColuna = palavraObj.colunaFim - palavraObj.colunaInicio;
    const steps = Math.max(Math.abs(deltaLinha), Math.abs(deltaColuna));
    const stepLinha = steps === 0 ? 0 : deltaLinha / steps;
    const stepColuna = steps === 0 ? 0 : deltaColuna / steps;

    for (let i = 0; i <= steps; i++) {
      const l = palavraObj.linhaInicio + Math.round(stepLinha * i);
      const c = palavraObj.colunaInicio + Math.round(stepColuna * i);
      celulas.push(`${l}-${c}`);
    }
    return celulas;
  };

  // Mapa de todas as células das palavras para visualização
  const getCelulasTodasPalavras = () => {
    const celulasMap = {};    if (jogo?.palavras) {
      jogo.palavras.forEach((p, index) => {
        const celulas = getCelulasVisualizacao(p);
        celulas.forEach(cell => {
          celulasMap[cell] = { palavra: p.palavra, corIndex: index % 6 };
        });
      });
    }
    return celulasMap;
  };

  // Modo de visualização para professor/coordenador
  if (isModoVisualizacao) {
    const celulasVisualizacao = getCelulasTodasPalavras();

    return (
      <div className="jogar-partida-overlay">
        <div className="jogar-partida-container modo-visualizacao">
          <div className="jogar-partida-header">
            <div className="jogo-info">
              <h2>{jogo.titulo}</h2>
              <span className="jogo-tema">{jogo.tema}</span>
            </div>
            <div className="modo-visualizacao-badge">
              <Eye size={16} />
              <span>Modo Visualização</span>
            </div>
            <button className="btn-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="visualizacao-aviso">
            <Eye size={18} />
            <span>Você está visualizando o tabuleiro como professor. As palavras estão destacadas abaixo.</span>
          </div>

          <div className="jogar-partida-content">
            <div className="palavras-para-encontrar">
              <h3>Palavras no tabuleiro:</h3>
              <div className="palavras-lista">
                {jogo.palavras.map((p, index) => (
                  <span
                    key={p.palavra}
                    className={`palavra-tag visualizacao-cor-${index % 6}`}
                  >
                    {p.palavra}
                  </span>
                ))}
              </div>
            </div>

            <div 
              className="tabuleiro-jogo visualizacao"
              style={{
                gridTemplateColumns: `repeat(${jogo.largura}, 1fr)`,
                gridTemplateRows: `repeat(${jogo.altura}, 1fr)`
              }}
            >
              {jogo.tabuleiro.map((row, linha) =>
                row.map((letra, coluna) => {
                  const cellKey = `${linha}-${coluna}`;
                  const celulaInfo = celulasVisualizacao[cellKey];
                  const classes = ['jogo-cell'];
                  if (celulaInfo) {
                    classes.push('visualizacao-destaque');
                    classes.push(`visualizacao-cor-${celulaInfo.corIndex}`);
                  }
                  return (
                    <div
                      key={cellKey}
                      className={classes.join(' ')}
                    >
                      {letra}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="visualizacao-footer">
            <button className="btn-fechar" onClick={onClose}>
              Fechar Visualização
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jogar-partida-overlay">
      <div className="jogar-partida-container">
        <div className="jogar-partida-header">
          <div className="jogo-info">
            <h2>{jogo.titulo}</h2>
            <span className="jogo-tema">{jogo.tema}</span>
          </div>
          <button className="btn-close" onClick={handleCloseClick}>
            <X size={24} />
          </button>
        </div>

        <div className="jogar-partida-stats">
          <div className="stat-item">
            <Clock size={20} />
            <span>{formatarTempo(tempoDecorrido)}</span>
          </div>
          <div className="stat-item">
            <CheckCircle size={20} />
            <span>{palavrasEncontradas.length}/{jogo.palavras.length} palavras</span>
          </div>
          <div className="stat-item pontuacao">
            <Trophy size={20} />
            <span>{jogoFinalizado ? pontuacao : calcularPontuacao()} pts</span>
          </div>
        </div>

        <div className="jogar-partida-content">
          <div className="palavras-para-encontrar">
            <h3>Palavras para encontrar:</h3>
            <div className="palavras-lista">
              {jogo.palavras.map((p) => (
                <span
                  key={p.palavra}
                  className={`palavra-tag ${palavrasEncontradas.includes(p.palavra) ? 'encontrada' : ''}`}
                >
                  {p.palavra}
                </span>
              ))}
            </div>
          </div>

          <div 
            className="tabuleiro-jogo"
            style={{
              gridTemplateColumns: `repeat(${jogo.largura}, 1fr)`,
              gridTemplateRows: `repeat(${jogo.altura}, 1fr)`
            }}
            onMouseLeave={() => {
              if (isSelecting) {
                setIsSelecting(false);
                setSelecaoAtual([]);
              }
            }}
          >
            {jogo.tabuleiro.map((row, linha) =>
              row.map((letra, coluna) => (
                <div
                  key={`${linha}-${coluna}`}
                  className={getCellClass(linha, coluna)}
                  onMouseDown={() => handleMouseDown(linha, coluna)}
                  onMouseEnter={() => handleMouseEnter(linha, coluna)}
                  onMouseUp={handleMouseUp}
                >
                  {letra}
                </div>
              ))
            )}
          </div>
        </div>{jogoFinalizado && (
          <div className="jogo-finalizado-overlay">
            <div className="jogo-finalizado-modal">
              <Sparkles size={48} className="icone-celebracao" />
              <h2>Parabéns! 🎉</h2>
              <p>Você encontrou todas as palavras!</p>
              
              <div className="resultado-stats">
                <div className="resultado-item">
                  <Clock size={24} />
                  <span>Tempo: {formatarTempo(tempoDecorrido)}</span>
                </div>
                <div className="resultado-item">
                  <Trophy size={24} />
                  <span>Pontuação: {pontuacao}</span>
                </div>
              </div>

              <div className="resultado-actions">
                <button className="btn-fechar" onClick={() => { onFinish?.(); onClose(); }}>
                  Voltar para Turma
                </button>
              </div>
            </div>
          </div>
        )}        {mostrarAlertaSaida && (
          <div className="alerta-saida-overlay">
            <div className="alerta-saida-modal">
              <AlertTriangle size={48} className="icone-alerta-saida" />
              <h2>Atenção!</h2>
              <p>Se você sair agora, sua pontuação será salva e você <strong>não poderá jogar novamente</strong>.</p>
              <p className="alerta-detalhe">
                Você encontrou {palavrasEncontradas.length} de {jogo?.palavras?.length || 0} palavras.
                <br />
                Pontuação atual: <strong>{calcularPontuacao()} pts</strong>
              </p>
              
              <div className="alerta-actions">
                <button className="btn-continuar" onClick={cancelarSaida}>
                  Continuar Jogando
                </button>
                <button className="btn-sair" onClick={confirmarSaida}>
                  Sair e Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
