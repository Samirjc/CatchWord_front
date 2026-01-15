import { X, Grid3X3, Gamepad2 } from 'lucide-react';
import './styles/VisualizarJogo.css';

export function VisualizarJogo({ jogo, onClose }) {
  if (!jogo) return null;

  return (
    <div className="visualizar-overlay">
      <div className="visualizar-container">
        <div className="visualizar-header">
          <div className="visualizar-title">
            <h2>{jogo.titulo}</h2>
            <span className="tema-badge">{jogo.tema}</span>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="visualizar-content">
          <div className="tabuleiro-section">
            <div className="section-header">
              <Grid3X3 size={18} />
              <h3>Tabuleiro ({jogo.largura}x{jogo.altura})</h3>
            </div>
            
            <div 
              className="tabuleiro-visualizar"
              style={{
                gridTemplateColumns: `repeat(${jogo.largura}, 1fr)`,
                gridTemplateRows: `repeat(${jogo.altura}, 1fr)`
              }}
            >
              {jogo.tabuleiro?.map((row, rowIndex) =>
                row.map((letra, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className="tabuleiro-cell-view"
                  >
                    {letra}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="palavras-section">
            <div className="section-header">
              <Gamepad2 size={18} />
              <h3>Palavras ({jogo.palavras?.length || 0})</h3>
            </div>
              <div className="palavras-grid">
              {jogo.palavras?.map((palavra) => (
                <div key={palavra.palavra} className="palavra-badge">
                  {palavra.palavra}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
