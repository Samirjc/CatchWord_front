import './Logo.css'

export function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <span className="logo-emoji">🔍</span>
      </div>
      <h1 className="logo-text">
        Caça<span className="logo-highlight">Palavras</span>
      </h1>
    </div>
  );
}