import { useState } from 'react';
import { BookOpen, Users, PencilRuler, GraduationCap, BarChart3, Settings, LogOut } from 'lucide-react';
import { Logo } from '../Logo/Logo';
import { TurmasContent } from '../../pages/Home/Turmas/Turmas';
import { ProfessoresContent } from '../../pages/Home/Professores/Professores';
import { AlunosContent } from '../../pages/Home/Alunos/Alunos';
import { JogosContent } from '../../pages/Home/Jogos/Jogos';
import { EstatisticasContent } from '../../pages/Home/Estatisticas/Estatisticas';
import { ConfiguracoesContent } from '../../pages/Home/Configuracoes/Configuracoes';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { useSair } from '../../services/Sair/Sair';
import './Menu.css';

function MenuItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  const isSair = item.id === 'sair';
  
  return (
    <button
      onClick={onClick}
      className={`menu-item ${isActive ? 'active' : 'inactive'} ${isSair ? 'sair' : ''}`}
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </button>
  );
}

function MenuSection({ items, activeItem, onItemClick }) {
  return (
    <nav className="menu-nav">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          isActive={activeItem === item.id}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </nav>
  );
}

function Sidebar({ activeItem, onItemClick, menuItems, bottomItems }) {
  return (
    <div className="menu-sidebar">
      <Logo />
      
      <div className="menu-section">
        <MenuSection
          items={menuItems}
          activeItem={activeItem}
          onItemClick={onItemClick}
        />
      </div>

      <div className="menu-bottom">
        <MenuSection
          items={bottomItems}
          activeItem={activeItem}
          onItemClick={onItemClick}
        />
      </div>
    </div>
  );
}

function MainContent({ activeItem, menuItems, bottomItems, userProfile }) {
  const currentItem = menuItems.find(i => i.id === activeItem) || bottomItems.find(i => i.id === activeItem);
  
  // Renderiza o conteúdo específico da seção Jogos
  if (activeItem === 'jogos') {
    return <JogosContent />;
  }

  // Renderiza o conteúdo específico da seção Turmas
  if (activeItem === 'turmas') {
    return <TurmasContent userProfile={userProfile} />;
  }
  
  if (activeItem === 'professores') {
    return <ProfessoresContent/>;
  }
  if (activeItem === 'alunos'){
    return <AlunosContent/>
  }

  if (activeItem === 'estatisticas') {
    return <EstatisticasContent userProfile={userProfile} />;
  }

  // Renderiza o conteúdo específico da seção Configurações
  if (activeItem === 'configuracoes') {
    return <ConfiguracoesContent />;
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        <h1 className="content-title">Meus Jogos</h1>
        <p className="content-subtitle">Gerencie seus jogos de caça-palavras</p>
        
        <div className="content-card">
          <p className="content-text">
            Conteúdo da seção <span className="content-highlight">{currentItem?.label}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SidebarMenu() {
  const sair = useSair();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Obtém o perfil do usuário do localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const userProfile = usuario.role?.toLowerCase() || 'professor';
  
  const menuItems = [
    // Jogos só aparece para professores
    ...(userProfile === 'professor' ? [
      { id: 'jogos', label: 'Jogos', icon: BookOpen },
    ] : []),
    { id: 'turmas', label: 'Turmas', icon: Users },
    // Professores e Alunos só aparecem para coordenadores
    ...(userProfile === 'coordenador' ? [
      { id: 'professores', label: 'Professores', icon: PencilRuler },
      { id: 'alunos', label: 'Alunos', icon: GraduationCap },
    ] : []),
    { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
  ];

  // Inicializa com o primeiro item do menu
  const [activeItem, setActiveItem] = useState(menuItems[0]?.id || 'turmas');

  const bottomItems = [
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'sair', label: 'Sair', icon: LogOut },
  ];

  const handleItemClick = (itemId) => {
    if (itemId === 'sair') {
      setShowLogoutModal(true);
    } else {
      setActiveItem(itemId);
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    sair();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="app-container">
      <Sidebar
        activeItem={activeItem}
        onItemClick={handleItemClick}
        menuItems={menuItems}
        bottomItems={bottomItems}
      />
      <MainContent
        activeItem={activeItem}
        menuItems={menuItems}
        bottomItems={bottomItems}
        userProfile={userProfile}
      />
      
      <ConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        title="Sair da conta"
        message="Tem certeza que deseja encerrar sua sessão?"
        confirmText="Sair"
        cancelText="Cancelar"
        icon={LogOut}
        variant="danger"
      />
    </div>
  );
}