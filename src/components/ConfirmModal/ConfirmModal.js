import { LogOut } from 'lucide-react';
import './ConfirmModal.css';

export function ConfirmModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  icon: Icon = LogOut,
  variant = 'danger' // 'danger' | 'warning' | 'info'
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-container" onClick={e => e.stopPropagation()}>
        <div className={`confirm-modal-icon ${variant}`}>
          <Icon size={32} />
        </div>
        
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        
        <div className="confirm-modal-buttons">
          <button 
            className="confirm-modal-btn cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal-btn confirm ${variant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
