import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, RotateCcw, Sparkles, Info, Check, AlertCircle } from 'lucide-react';
import './styles/CriarJogo.css';

const DIRECOES = [
  { nome: 'Horizontal →', dx: 1, dy: 0 },
  { nome: 'Horizontal ←', dx: -1, dy: 0 },
  { nome: 'Vertical ↓', dx: 0, dy: 1 },
  { nome: 'Vertical ↑', dx: 0, dy: -1 },
  { nome: 'Diagonal ↘', dx: 1, dy: 1 },
  { nome: 'Diagonal ↖', dx: -1, dy: -1 },
  { nome: 'Diagonal ↗', dx: 1, dy: -1 },
  { nome: 'Diagonal ↙', dx: -1, dy: 1 },
];

const DIFICULDADES = [
  { value: 'FACIL', label: 'Fácil', desc: 'Palavras mais curtas e comuns' },
  { value: 'MEDIO', label: 'Médio', desc: 'Desafio moderado' },
  { value: 'DIFICIL', label: 'Difícil', desc: 'Palavras mais longas e complexas' },
];

// Componente para input de palavra
function PalavraInput({ palavra, index, onRemove, onUpdate, largura, altura, palavrasExistentes }) {
  const [erro, setErro] = useState('');
  const [posicionada, setPosicionada] = useState(false);

  useEffect(() => {
    validarPalavra();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palavra, largura, altura]);

  const validarPalavra = () => {
    if (!palavra.texto) {
      setErro('');
      setPosicionada(false);
      return;
    }

    if (palavra.linhaInicio === null || palavra.colunaInicio === null) {
      setErro('Posicione a palavra no tabuleiro');
      setPosicionada(false);
      return;
    }

    // Verificar se cabe no tabuleiro
    const direcao = DIRECOES[palavra.direcaoIndex || 0];
    const linhaFim = palavra.linhaInicio + (palavra.texto.length - 1) * direcao.dy;
    const colunaFim = palavra.colunaInicio + (palavra.texto.length - 1) * direcao.dx;

    if (linhaFim < 0 || linhaFim >= altura || colunaFim < 0 || colunaFim >= largura) {
      setErro('Palavra não cabe na direção escolhida');
      setPosicionada(false);
      return;
    }

    setErro('');
    setPosicionada(true);
  };
  const handleTextChange = (e) => {
    const texto = e.target.value.toUpperCase().replaceAll(/[^A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/g, '');
    onUpdate(index, { ...palavra, texto });
  };

  const handleDirecaoChange = (e) => {
    onUpdate(index, { ...palavra, direcaoIndex: Number.parseInt(e.target.value) });
  };

  return (
    <div className={`palavra-input-item ${posicionada ? 'posicionada' : ''} ${erro ? 'com-erro' : ''}`}>
      <div className="palavra-input-row">
        <div className="palavra-numero">{index + 1}</div>
        <input
          type="text"
          value={palavra.texto || ''}
          onChange={handleTextChange}
          placeholder="Digite a palavra"
          className="palavra-texto-input"
          maxLength={Math.max(largura, altura)}
        />        <select 
          value={palavra.direcaoIndex || 0} 
          onChange={handleDirecaoChange}
          className="palavra-direcao-select"
        >
          {DIRECOES.map((dir) => (
            <option key={dir.nome} value={DIRECOES.indexOf(dir)}>{dir.nome}</option>
          ))}
        </select>
        <button 
          type="button" 
          className="btn-remove-palavra" 
          onClick={() => onRemove(index)}
          title="Remover palavra"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {erro && (
        <div className="palavra-erro">
          <AlertCircle size={14} />
          <span>{erro}</span>
        </div>
      )}
      {posicionada && !erro && (
        <div className="palavra-sucesso">
          <Check size={14} />
          <span>Posicionada no tabuleiro</span>
        </div>
      )}
    </div>
  );
}

// Componente do tabuleiro interativo
function TabuleiroEditor({ largura, altura, palavras, onCellClick, palavraSelecionada }) {
  const [tabuleiro, setTabuleiro] = useState([]);
  const [celulasOcupadas, setCelulasOcupadas] = useState({});
  // Gerar tabuleiro vazio
  useEffect(() => {
    const novoTabuleiro = new Array(altura).fill().map(() => 
      new Array(largura).fill({ letra: '', palavraIndex: null })
    );
    setTabuleiro(novoTabuleiro);
  }, [largura, altura]);

  // Atualizar células ocupadas baseado nas palavras posicionadas
  useEffect(() => {
    const novasOcupadas = {};
    
    palavras.forEach((palavra, palavraIndex) => {
      if (palavra.texto && palavra.linhaInicio !== null && palavra.colunaInicio !== null) {
        const direcao = DIRECOES[palavra.direcaoIndex || 0];
        
        for (let i = 0; i < palavra.texto.length; i++) {
          const linha = palavra.linhaInicio + i * direcao.dy;
          const coluna = palavra.colunaInicio + i * direcao.dx;
          
          if (linha >= 0 && linha < altura && coluna >= 0 && coluna < largura) {
            const key = `${linha}-${coluna}`;
            novasOcupadas[key] = {
              letra: palavra.texto[i],
              palavraIndex,
              letraIndex: i
            };
          }
        }
      }
    });
    
    setCelulasOcupadas(novasOcupadas);
  }, [palavras, largura, altura]);

  const getCellClass = (linha, coluna) => {
    const key = `${linha}-${coluna}`;
    const celula = celulasOcupadas[key];
    
    let classes = ['tabuleiro-cell'];
    
    if (celula) {
      classes.push('ocupada');
      if (palavraSelecionada !== null && celula.palavraIndex === palavraSelecionada) {
        classes.push('selecionada');
      }
    }
    
    // Preview da posição se tiver palavra selecionada
    if (palavraSelecionada !== null && !celula) {
      const palavra = palavras[palavraSelecionada];
      if (palavra?.texto && palavra.linhaInicio === null) {
        // Mostrar preview de onde a palavra ficaria
        const direcao = DIRECOES[palavra.direcaoIndex || 0];
        for (let i = 0; i < palavra.texto.length; i++) {
          const previewLinha = linha + i * direcao.dy;
          const previewColuna = coluna + i * direcao.dx;
          if (previewLinha === linha && previewColuna === coluna) {
            classes.push('preview-start');
            break;
          }
        }
      }
    }
    
    return classes.join(' ');
  };

  const handleCellClick = (linha, coluna) => {
    onCellClick(linha, coluna);
  };

  // Mostrar preview ao passar o mouse
  const [previewCells, setPreviewCells] = useState([]);

  const handleCellHover = (linha, coluna) => {
    if (palavraSelecionada === null) {
      setPreviewCells([]);
      return;
    }

    const palavra = palavras[palavraSelecionada];
    if (!palavra?.texto || palavra.linhaInicio !== null) {
      setPreviewCells([]);
      return;
    }

    const direcao = DIRECOES[palavra.direcaoIndex || 0];
    const preview = [];
    
    for (let i = 0; i < palavra.texto.length; i++) {
      const pLinha = linha + i * direcao.dy;
      const pColuna = coluna + i * direcao.dx;
      
      if (pLinha >= 0 && pLinha < altura && pColuna >= 0 && pColuna < largura) {
        preview.push({ linha: pLinha, coluna: pColuna, letra: palavra.texto[i] });
      }
    }
    
    setPreviewCells(preview);
  };

  const isPreviewCell = (linha, coluna) => {
    return previewCells.some(p => p.linha === linha && p.coluna === coluna);
  };

  const getPreviewLetra = (linha, coluna) => {
    const cell = previewCells.find(p => p.linha === linha && p.coluna === coluna);
    return cell?.letra || '';
  };

  return (
    <div className="tabuleiro-container">
      <div 
        className="tabuleiro-grid"
        style={{
          gridTemplateColumns: `repeat(${largura}, 1fr)`,
          gridTemplateRows: `repeat(${altura}, 1fr)`
        }}
        onMouseLeave={() => setPreviewCells([])}
      >
        {tabuleiro.map((row, linha) =>
          row.map((_, coluna) => {
            const key = `${linha}-${coluna}`;
            const celula = celulasOcupadas[key];
            const isPreview = isPreviewCell(linha, coluna);
            
            return (
              <div
                key={key}
                className={`${getCellClass(linha, coluna)} ${isPreview ? 'preview' : ''}`}
                onClick={() => handleCellClick(linha, coluna)}
                onMouseEnter={() => handleCellHover(linha, coluna)}
              >
                {celula?.letra || (isPreview ? getPreviewLetra(linha, coluna) : '')}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Componente principal do formulário
export function JogoForm({ jogo = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tema: '',
    dificuldade: 'FACIL',
    largura: 12,
    altura: 12,
    ativo: true
  });
  
  const [palavras, setPalavras] = useState([
    { texto: '', linhaInicio: null, colunaInicio: null, direcaoIndex: 0 }
  ]);
  
  const [palavraSelecionada, setPalavraSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [step, setStep] = useState(1); // 1: Info básica, 2: Tabuleiro
  const isEditMode = !!jogo;

  useEffect(() => {
    if (jogo) {
      setFormData({
        titulo: jogo.titulo || '',
        descricao: jogo.descricao || '',
        tema: jogo.tema || '',
        dificuldade: jogo.dificuldade || 'FACIL',
        largura: jogo.largura || 12,
        altura: jogo.altura || 12,
        ativo: jogo.ativo !== false
      });
      // No modo edição, não permitimos alterar o tabuleiro
      setStep(1);
    }
  }, [jogo]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleDimensaoChange = (tipo, valor) => {
    const novoValor = Math.max(5, Math.min(20, Number.parseInt(valor) || 10));
    setFormData(prev => ({
      ...prev,
      [tipo]: novoValor
    }));
    
    // Resetar posições das palavras quando mudar dimensões
    setPalavras(prev => prev.map(p => ({
      ...p,
      linhaInicio: null,
      colunaInicio: null
    })));
  };

  const adicionarPalavra = () => {
    setPalavras(prev => [
      ...prev,
      { texto: '', linhaInicio: null, colunaInicio: null, direcaoIndex: 0 }
    ]);
  };

  const removerPalavra = (index) => {
    if (palavras.length <= 1) return;
    setPalavras(prev => prev.filter((_, i) => i !== index));
    if (palavraSelecionada === index) {
      setPalavraSelecionada(null);
    } else if (palavraSelecionada > index) {
      setPalavraSelecionada(prev => prev - 1);
    }
  };
  const atualizarPalavra = (index, novaPalavra) => {
    setPalavras(prev => prev.map((p, i) => i === index ? novaPalavra : p));
  };

  // Função para obter as células ocupadas por outras palavras
  const obterCelulasOcupadas = useCallback((excluirIndex = null) => {
    const ocupadas = {};
    
    palavras.forEach((p, idx) => {
      if (idx === excluirIndex) return;
      if (!p.texto || p.linhaInicio === null || p.colunaInicio === null) return;
      
      const direcao = DIRECOES[p.direcaoIndex || 0];
      
      for (let i = 0; i < p.texto.length; i++) {
        const l = p.linhaInicio + i * direcao.dy;
        const c = p.colunaInicio + i * direcao.dx;
        const key = `${l}-${c}`;
        ocupadas[key] = p.texto[i].toUpperCase();
      }
    });
    
    return ocupadas;
  }, [palavras]);

  // Função para verificar conflito de intersecção
  const verificarConflito = useCallback((palavra, linha, coluna, celulasOcupadas) => {
    const direcao = DIRECOES[palavra.direcaoIndex || 0];
    
    for (let i = 0; i < palavra.texto.length; i++) {
      const l = linha + i * direcao.dy;
      const c = coluna + i * direcao.dx;
      const key = `${l}-${c}`;
      
      if (celulasOcupadas[key]) {
        const letraExistente = celulasOcupadas[key];
        const letraNova = palavra.texto[i].toUpperCase();
        
        if (letraExistente !== letraNova) {
          return {
            conflito: true,
            mensagem: `Conflito na posição (${l + 1}, ${c + 1}): letra "${letraNova}" cruza com "${letraExistente}"`
          };
        }
      }
    }
    
    return { conflito: false };
  }, []);

  const handleCellClick = useCallback((linha, coluna) => {
    if (palavraSelecionada === null) return;
    
    const palavra = palavras[palavraSelecionada];
    if (!palavra?.texto) return;

    // Se já está posicionada, remove a posição
    if (palavra.linhaInicio !== null) {
      atualizarPalavra(palavraSelecionada, {
        ...palavra,
        linhaInicio: null,
        colunaInicio: null
      });
      return;
    }

    // Verificar se a palavra cabe na direção escolhida
    const direcao = DIRECOES[palavra.direcaoIndex || 0];
    const linhaFim = linha + (palavra.texto.length - 1) * direcao.dy;
    const colunaFim = coluna + (palavra.texto.length - 1) * direcao.dx;

    if (linhaFim < 0 || linhaFim >= formData.altura || colunaFim < 0 || colunaFim >= formData.largura) {
      setErro('A palavra não cabe nessa posição com a direção escolhida');
      setTimeout(() => setErro(''), 3000);
      return;
    }

    // Verificar conflito de intersecção com outras palavras
    const celulasOcupadas = obterCelulasOcupadas(palavraSelecionada);
    const resultado = verificarConflito(palavra, linha, coluna, celulasOcupadas);
    
    if (resultado.conflito) {
      setErro(resultado.mensagem);
      setTimeout(() => setErro(''), 4000);
      return;
    }

    // Posicionar a palavra
    atualizarPalavra(palavraSelecionada, {
      ...palavra,
      linhaInicio: linha,
      colunaInicio: coluna
    });
  }, [palavraSelecionada, palavras, formData.altura, formData.largura, obterCelulasOcupadas, verificarConflito]);

  const limparTabuleiro = () => {
    setPalavras(prev => prev.map(p => ({
      ...p,
      linhaInicio: null,
      colunaInicio: null
    })));
  };

  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      setErro('O título é obrigatório');
      return false;
    }
    if (!formData.tema.trim()) {
      setErro('O tema é obrigatório');
      return false;
    }
    
    if (!isEditMode) {
      const palavrasValidas = palavras.filter(p => p.texto && p.linhaInicio !== null);
      if (palavrasValidas.length === 0) {
        setErro('Adicione e posicione pelo menos uma palavra no tabuleiro');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      if (isEditMode) {
        // Modo edição - enviar apenas campos editáveis
        await onSave({
          titulo: formData.titulo,
          descricao: formData.descricao,
          dificuldade: formData.dificuldade,
          ativo: formData.ativo
        });
      } else {
        // Modo criação - enviar dados completos
        const palavrasParaEnviar = palavras
          .filter(p => p.texto && p.linhaInicio !== null)
          .map(p => {
            const direcao = DIRECOES[p.direcaoIndex || 0];
            return {
              palavra: p.texto,
              linhaInicio: p.linhaInicio,
              colunaInicio: p.colunaInicio,
              linhaFim: p.linhaInicio + (p.texto.length - 1) * direcao.dy,
              colunaFim: p.colunaInicio + (p.texto.length - 1) * direcao.dx
            };
          });

        await onSave({
          ...formData,
          palavras: palavrasParaEnviar
        });
      }
    } catch (err) {
      setErro(err.message || 'Erro ao salvar jogo');
    } finally {
      setLoading(false);
    }
  };

  const palavrasValidas = palavras.filter(p => p.texto && p.linhaInicio !== null);
  const todasPalavrasPosicionadas = palavras.filter(p => p.texto).length === palavrasValidas.length && palavrasValidas.length > 0;

  return (
    <div className="jogo-form-overlay">
      <div className={`jogo-form-container ${isEditMode ? '' : 'modo-criacao'}`}>
        <div className="jogo-form-header">
          <h2>{isEditMode ? 'Editar Jogo' : 'Criar Novo Jogo'}</h2>
          <button type="button" className="btn-close" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        {erro && (
          <div className="form-error-banner">
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="jogo-form">
          {!isEditMode && (
            <div className="form-steps">
              <button 
                type="button"
                className={`step-btn ${step === 1 ? 'active' : ''} ${formData.titulo && formData.tema ? 'completed' : ''}`}
                onClick={() => setStep(1)}
              >
                <span className="step-number">1</span>
                <span className="step-label">Informações</span>
              </button>
              <div className="step-divider"></div>
              <button 
                type="button"
                className={`step-btn ${step === 2 ? 'active' : ''} ${todasPalavrasPosicionadas ? 'completed' : ''}`}
                onClick={() => formData.titulo && formData.tema && setStep(2)}
                disabled={!formData.titulo || !formData.tema}
              >
                <span className="step-number">2</span>
                <span className="step-label">Tabuleiro</span>
              </button>
            </div>
          )}

          {/* Step 1: Informações básicas */}
          {(step === 1 || isEditMode) && (
            <div className="form-step-content">
              <div className="form-section">
                <h3 className="section-title">
                  <Sparkles size={18} />
                  Informações do Jogo
                </h3>
                
                <div className="form-group">
                  <label htmlFor="titulo">Título do Jogo *</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ex: Caça-Palavras dos Animais"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva o objetivo do jogo..."
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tema">Tema *</label>
                    <input
                      type="text"
                      id="tema"
                      name="tema"
                      value={formData.tema}
                      onChange={handleInputChange}
                      placeholder="Ex: Animais, Frutas, Verbos..."
                      required
                      disabled={isEditMode}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dificuldade">Dificuldade</label>
                    <select
                      id="dificuldade"
                      name="dificuldade"
                      value={formData.dificuldade}
                      onChange={handleInputChange}
                    >
                      {DIFICULDADES.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {!isEditMode && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Largura do Tabuleiro</label>
                      <div className="dimension-input">
                        <button 
                          type="button" 
                          onClick={() => handleDimensaoChange('largura', formData.largura - 1)}
                          disabled={formData.largura <= 5}
                        >-</button>
                        <span>{formData.largura}</span>
                        <button 
                          type="button" 
                          onClick={() => handleDimensaoChange('largura', formData.largura + 1)}
                          disabled={formData.largura >= 20}
                        >+</button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Altura do Tabuleiro</label>
                      <div className="dimension-input">
                        <button 
                          type="button" 
                          onClick={() => handleDimensaoChange('altura', formData.altura - 1)}
                          disabled={formData.altura <= 5}
                        >-</button>
                        <span>{formData.altura}</span>
                        <button 
                          type="button" 
                          onClick={() => handleDimensaoChange('altura', formData.altura + 1)}
                          disabled={formData.altura >= 20}
                        >+</button>
                      </div>
                    </div>
                  </div>
                )}

                {isEditMode && (
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={handleInputChange}
                      />
                      <span className="checkbox-custom"></span>
                      Jogo ativo
                    </label>
                    <span className="form-hint">Jogos inativos não aparecem para os alunos</span>
                  </div>
                )}
              </div>

              {!isEditMode && (
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn-next"
                    onClick={() => setStep(2)}
                    disabled={!formData.titulo || !formData.tema}
                  >
                    Próximo: Montar Tabuleiro
                  </button>
                </div>
              )}

              {isEditMode && (
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Tabuleiro (apenas modo criação) */}
          {step === 2 && !isEditMode && (
            <div className="form-step-content tabuleiro-step">
              <div className="tabuleiro-layout">
                <div className="palavras-panel">
                  <div className="panel-header">
                    <h3>
                      <span className="panel-icon">📝</span>
                      Palavras
                    </h3>
                    <button 
                      type="button" 
                      className="btn-add-palavra"
                      onClick={adicionarPalavra}
                    >
                      <Plus size={16} />
                      Adicionar
                    </button>
                  </div>

                  <div className="instrucoes-box">
                    <Info size={16} />
                    <p>Digite as palavras, escolha a direção e clique no tabuleiro para posicioná-las.</p>
                  </div>

                  <div className="palavras-list">
                    {palavras.map((palavra, index) => (
                      <div 
                        key={index}
                        className={`palavra-wrapper ${palavraSelecionada === index ? 'selected' : ''}`}
                        onClick={() => setPalavraSelecionada(index)}
                      >
                        <PalavraInput
                          palavra={palavra}
                          index={index}
                          onRemove={removerPalavra}
                          onUpdate={atualizarPalavra}
                          largura={formData.largura}
                          altura={formData.altura}
                          palavrasExistentes={palavras}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="palavras-summary">
                    <span className={palavrasValidas.length > 0 ? 'success' : ''}>
                      {palavrasValidas.length} palavra(s) posicionada(s)
                    </span>
                  </div>
                </div>

                <div className="tabuleiro-panel">
                  <div className="panel-header">
                    <h3>
                      <span className="panel-icon">🎮</span>
                      Tabuleiro ({formData.largura}x{formData.altura})
                    </h3>
                    <button 
                      type="button" 
                      className="btn-limpar"
                      onClick={limparTabuleiro}
                      title="Limpar todas as posições"
                    >
                      <RotateCcw size={16} />
                      Limpar
                    </button>
                  </div>

                  {palavraSelecionada !== null && palavras[palavraSelecionada]?.texto && (
                    <div className="tabuleiro-hint">
                      <Sparkles size={14} />
                      Clique no tabuleiro para posicionar "{palavras[palavraSelecionada].texto}"
                    </div>
                  )}

                  <TabuleiroEditor
                    largura={formData.largura}
                    altura={formData.altura}
                    palavras={palavras}
                    onCellClick={handleCellClick}
                    palavraSelecionada={palavraSelecionada}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-back" onClick={() => setStep(1)}>
                  ← Voltar
                </button>
                <button type="button" className="btn-cancel" onClick={onCancel}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={loading || !todasPalavrasPosicionadas}
                >
                  {loading ? 'Criando...' : `Criar Jogo (${palavrasValidas.length} palavras)`}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
