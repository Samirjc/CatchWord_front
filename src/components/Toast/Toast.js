import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

export function Toast({ mensagem, tipo, onClose, duracao = 4000 }) {
  useEffect(() => {
    if (mensagem && duracao > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duracao);

      return () => clearTimeout(timer);
    }
  }, [mensagem, duracao, onClose]);

  if (!mensagem) return null;

  const getIcon = () => {
    switch (tipo) {
      case 'sucesso':
        return <CheckCircle size={20} />;
      case 'erro':
        return <XCircle size={20} />;
      case 'alerta':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast toast-${tipo}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <span className="toast-message">{mensagem}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
