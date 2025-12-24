import './Logo.css'

export function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <span className="logo-emoji">🔍</span>
      </div>
      <h1 className="logo-text">
        Catch<span className="logo-highlight">Word</span>
      </h1>
    </div>
  );
}