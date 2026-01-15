import {PageHeader} from '../../components/PageHeader/PageHeader';
import { useNavigate } from 'react-router-dom';
import './styles/Sucesso.css';

export default function SuccessScreen() {
  const navigate = useNavigate();

  const handleAccess = () => {
    navigate('/login');
  };

  return (
      <div className="success-container">
        <div className="success-main-content">
          <div className="success-wrapper">
            <div className='success-card'>
              <PageHeader
                title="Inscrição Bem-Sucedida"
                subtitle="Logo abaixo segue o botão de acesso"
              />
              <button onClick={handleAccess} className='success-button'> Acessar </button>
            </div>
            </div>
          </div>
        </div>
    );
}