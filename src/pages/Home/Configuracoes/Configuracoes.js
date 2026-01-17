import { useState, useEffect } from 'react';
import { User, Mail, IdCard, Lock } from 'lucide-react';
import { endpoints } from '../../../services/API/api';
import { Toast } from '../../../components/Toast/Toast';
import './Configuracoes.css';

export function ConfiguracoesContent({userProfile}) {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
  // Estado do usuário
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    cpf: '',
    matricula: '',
    role: ''
  });
  
  // Estado do modal de alteração de senha
  const [mostrarAlterarSenha, setMostrarAlterarSenha] = useState(false);
  const [senhas, setSenhas] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  // Carrega informações do usuário
  useEffect(() => {
    const dadosUsuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    
    setUsuario({
      nome: dadosUsuario.nome || '',
      email: dadosUsuario.email || '',
      cpf: dadosUsuario.cpf || '',
      matricula: dadosUsuario.matricula || '',
      role: dadosUsuario.role || ''
    });
  }, []);

  // Altera senha - conectado ao backend
  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    
    if (senhas.novaSenha !== senhas.confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' });
      return;
    }
    
    if (senhas.novaSenha.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(endpoints.usuario.alterarSenha, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAtual: senhas.senhaAtual,
          novaSenha: senhas.novaSenha
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha');
      }
        setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
      setMostrarAlterarSenha(false);
      setSenhas({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.message || 'Erro ao alterar senha.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="content-wrapper configuracoes-wrapper">
        <h1 className="content-title">Configurações</h1>
        <p className="content-subtitle">Gerencie suas preferências e informações pessoais</p>
        
        {/* Toast para mensagens */}
        <Toast 
          mensagem={mensagem.texto} 
          tipo={mensagem.tipo} 
          onClose={() => setMensagem({ tipo: '', texto: '' })}
          duracao={4000}
        />

        <div className="configuracoes-container">
          {/* Seção de Perfil */}
          <div className="config-section">
              <div className="config-field">
                <label className="config-label">
                  <User size={16} />
                  Nome
                </label>
                <input
                  type="text"
                  value={usuario.nome}
                  className="config-input"
                  disabled
                />
              </div>

              <div className="config-field">
                <label className="config-label">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={usuario.email}
                  className="config-input"
                  disabled
                />
              </div>
            
              <div className="config-field">
                <label className="config-label">
                    <IdCard size={16} />
                    CPF
                </label>
                <input
                  type='text'
                  value={usuario.cpf}
                  className='config-input'
                  disabled
                  />
              </div>
              {userProfile === 'aluno' &&
              <div className="config-field">
                <label className="config-label">
                  <IdCard size={16} />
                  Matrícula
                </label>
                <input
                  type="text"
                  value={usuario.matricula}
                  className="config-input"
                  disabled
                />
              </div>
            }
          </div>

          {/* Seção de Segurança */}
          <div className="config-section">
            <div className="config-section-header">
              <Lock size={20} />
              <h2>Segurança</h2>
            </div>

            <button
              onClick={() => setMostrarAlterarSenha(!mostrarAlterarSenha)}
              className="btn-alterar-senha"
            >
              <Lock size={16} />
              Alterar Senha
            </button>

            {mostrarAlterarSenha && (
              <form onSubmit={handleAlterarSenha} className="form-alterar-senha">
                <div className="config-field">
                  <label className="config-label">Senha Atual</label>
                  <input
                    type="password"
                    value={senhas.senhaAtual}
                    onChange={(e) => setSenhas({ ...senhas, senhaAtual: e.target.value })}
                    className="config-input"
                    required
                  />
                </div>

                <div className="config-field">
                  <label className="config-label">Nova Senha</label>
                  <input
                    type="password"
                    value={senhas.novaSenha}
                    onChange={(e) => setSenhas({ ...senhas, novaSenha: e.target.value })}
                    className="config-input"
                    required
                  />
                </div>

                <div className="config-field">
                  <label className="config-label">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={senhas.confirmarSenha}
                    onChange={(e) => setSenhas({ ...senhas, confirmarSenha: e.target.value })}
                    className="config-input"
                    required
                  />
                </div>

                <div className="form-senha-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarAlterarSenha(false);
                      setSenhas({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
                    }}
                    className="btn-cancelar"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-confirmar"
                  >
                    {loading ? 'Salvando...' : 'Confirmar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
