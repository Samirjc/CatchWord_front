import { Sidebar } from '../../components/Sidebar/Sidebar.js';
import './styles/Erro_404.css';

function ErrorCard({ children }) {
  return (
    <div className="error-card-wrapper">
      <div className="error-card">
        {children}
      </div>
    </div>
  );
}


export default function ErrorScreen() {
  return (
    <div className="error-404-container">
      <Sidebar/>

      <div className="error-main-content">
        <ErrorCard>
          <h1 className='title'>Oops!</h1>
          <p className='subtitle'><em className='destaque'>Erro 404:</em> Página não encontrada</p>
        </ErrorCard>
      </div>
    </div>
  );
}