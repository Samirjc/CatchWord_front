import './PageHeader.css';

export function PageHeader({ title, subtitle }) {
  return (
    <>
      <h2 className="content-title">{title}</h2>
      <p className="content-subtitle">{subtitle}</p>
    </>
  );
}