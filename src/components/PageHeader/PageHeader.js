import './PageHeader.css';

export function PageHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="header-content-title">{title}</h2>
      <p className="header-content-subtitle">{subtitle}</p>
    </>
  );
}