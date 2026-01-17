import { useState, useEffect, useRef } from 'react';
import { User, Mail, IdCard, Bell, Type, Lock, Save, Camera } from 'lucide-react';
import { endpoints } from '../../../services/API/api';
import { Toast } from '../../../components/Toast/Toast';
import './Configuracoes.css';

export function ConfiguracoesContent() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const fileInputRef = useRef(null);
  
  // Estado do usuário
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    cpf: '',
    matricula: '',
    role: '',
    fotoPerfil: null
  });
  
  // Estado das configurações
  const [configuracoes, setConfiguracoes] = useState({
    notificacoes: true,
    tamanhoTexto: 'medio'
  });
  
  // Estado do modal de alteração de senha
  const [mostrarAlterarSenha, setMostrarAlterarSenha] = useState(false);
  const [senhas, setSenhas] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  // Carrega informações do usuário e configurações
  useEffect(() => {
    const dadosUsuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const fotoSalva = localStorage.getItem('fotoPerfil');
    const tamanhoTextoSalvo = localStorage.getItem('tamanhoTexto') || 'medio';
    const notificacoesSalvas = localStorage.getItem('notificacoes');
    
    setUsuario({
      nome: dadosUsuario.nome || '',
      email: dadosUsuario.email || '',
      cpf: dadosUsuario.cpf || '',
      matricula: dadosUsuario.matricula || '',
      role: dadosUsuario.role || '',
      fotoPerfil: fotoSalva
    });
    
    setConfiguracoes({
      notificacoes: notificacoesSalvas !== null ? notificacoesSalvas === 'true' : true,
      tamanhoTexto: tamanhoTextoSalvo
    });
    
    // Aplica o tamanho de texto salvo
    aplicarTamanhoTexto(tamanhoTextoSalvo);
  }, []);

  // Aplica tamanho de texto no body
  const aplicarTamanhoTexto = (tamanho) => {
    // Remove classes anteriores
    document.body.classList.remove('texto-pequeno', 'texto-medio', 'texto-grande');
    // Adiciona a nova classe
    document.body.classList.add(`texto-${tamanho}`);
  };

  // Gerencia upload de foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setMensagem({ tipo: 'erro', texto: 'A imagem deve ter no máximo 5MB.' });
        return;
      }
      
      const reader = new FileReader();      reader.onloadend = () => {
        setUsuario({ ...usuario, fotoPerfil: reader.result });
        localStorage.setItem('fotoPerfil', reader.result);
        setMensagem({ tipo: 'sucesso', texto: 'Foto atualizada com sucesso!' });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoverFoto = () => {
    setUsuario({ ...usuario, fotoPerfil: null });
    localStorage.removeItem('fotoPerfil');
    setMensagem({ tipo: 'sucesso', texto: 'Foto removida com sucesso!' });
  };

  // Atualiza checkbox de notificações
  const handleNotificacoesChange = (e) => {
    setConfiguracoes({
      ...configuracoes,
      notificacoes: e.target.checked
    });
  };

  // Atualiza tamanho do texto
  const handleTamanhoTextoChange = (e) => {
    const novoTamanho = e.target.value;
    setConfiguracoes({
      ...configuracoes,
      tamanhoTexto: novoTamanho
    });    // Aplica imediatamente
    aplicarTamanhoTexto(novoTamanho);
    // Salva no localStorage
    localStorage.setItem('tamanhoTexto', novoTamanho);
    setMensagem({ tipo: 'sucesso', texto: 'Tamanho do texto alterado!' });
  };

  // Salva alterações
  const handleSalvarAlteracoes = async () => {
    setLoading(true);
    try {
      // Salva no localStorage
      localStorage.setItem('notificacoes', configuracoes.notificacoes.toString());
      localStorage.setItem('tamanhoTexto', configuracoes.tamanhoTexto);
      
      // Aplica o tamanho de texto
      aplicarTamanhoTexto(configuracoes.tamanhoTexto);
        // Aqui você implementaria a chamada à API para salvar as configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMensagem({ tipo: 'sucesso', texto: 'Configurações salvas com sucesso!' });
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar configurações.' });
    } finally {
      setLoading(false);
    }
  };
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
  // Função para limpar a mensagem (usada pelo Toast)
  const limparMensagem = () => {
    setMensagem({ tipo: '', texto: '' });
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
          onClose={limparMensagem}
          duracao={4000}
        />

        <div className="configuracoes-container">
          {/* Seção de Perfil com Imagem */}
          <div className="config-section perfil-foto-section">
            <div className="perfil-foto-container">
              <div className="foto-wrapper">
                {usuario.fotoPerfil ? (
                  <img src={usuario.fotoPerfil} alt="Foto de perfil" className="foto-perfil" />
                ) : (
                  <div className="foto-placeholder">
                    <User size={48} />
                  </div>
                )}
                <button
                  className="btn-camera"
                  onClick={() => fileInputRef.current?.click()}
                  title="Alterar foto"
                >
                  <Camera size={20} />
                </button>
              </div>
              <div className="foto-info">
                <h3>{usuario.nome || 'Usuário'}</h3>
                <p className="role-badge">{usuario.role || 'Usuário'}</p>
                <div className="foto-actions">
                  {usuario.fotoPerfil && (
                    <button
                      className="btn-remover-foto"
                      onClick={handleRemoverFoto}
                    >
                      Remover foto
                    </button>
                  )}
                </div>
                <p className="foto-hint">JPG, PNG ou GIF (máx. 5MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Informações do Perfil */}
            <div className="perfil-info-section">
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
            </div>
          </div>

          {/* Seção de Preferências */}
          <div className="config-section">
            <div className="config-section-header">
              <Bell size={20} />
              <h2>Preferências</h2>
            </div>

            <div className="config-checkbox-field">
              <input
                type="checkbox"
                id="notificacoes"
                checked={configuracoes.notificacoes}
                onChange={handleNotificacoesChange}
                className="config-checkbox"
              />
              <label htmlFor="notificacoes" className="config-checkbox-label">
                <Bell size={16} />
                Notificações
              </label>
            </div>

            <div className="config-field">
              <label className="config-label">
                <Type size={16} />
                Tamanho do Texto
              </label>
              <select
                value={configuracoes.tamanhoTexto}
                onChange={handleTamanhoTextoChange}
                className="config-select"
              >
                <option value="pequeno">Pequeno</option>
                <option value="medio">Médio</option>
                <option value="grande">Grande</option>
              </select>
            </div>
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

          {/* Botão de Salvar */}
          <div className="config-actions">
            <button
              onClick={handleSalvarAlteracoes}
              disabled={loading}
              className="btn-salvar-config"
            >
              <Save size={16} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
