import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('não renderiza nada quando isOpen é false', () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Deseja excluir?"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renderiza título, mensagem e botões quando isOpen é true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Deseja excluir?"
        message="Esta ação não pode ser desfeita"
        confirmText="Sim, excluir"
        cancelText="Voltar"
      />
    );

    expect(screen.getByText('Deseja excluir?')).toBeInTheDocument();
    expect(screen.getByText('Esta ação não pode ser desfeita')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sim, excluir' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
  });

  test('chama onConfirm ao clicar no botão de confirmação', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirmar"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  test('chama onCancel ao clicar no botão de cancelar', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirmar"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
